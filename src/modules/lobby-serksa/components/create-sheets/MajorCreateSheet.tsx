import React from "react";
import { InputFormField, SearchSelectFormField } from "@components/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMajorsSchema, School } from "@modules/lobby-serksa/models";
import * as z from "zod";
import { Form, FormField } from "@components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@components/ui/sheet";
import { axiosInstance } from "@modules/lobby-serksa/fetch";
import { toast } from "@components/ui/use-toast";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
async function onCreateHandler(data: z.infer<typeof CreateMajorsSchema>) {
  const majors = data.majors.map((major) => {
    return {
      name: major.name,
      school_id: major.school.id,
    };
  });
  return axiosInstance.post(`/admin/majors`, majors).then((res) => {
    return res.data as { code: number; message: string };
  });
}

export function MajorCreateSheet({
  children,
  refetch,
}: {
  children: React.ReactNode;
  refetch: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<z.infer<typeof CreateMajorsSchema>>({
    resolver: zodResolver(CreateMajorsSchema),
    defaultValues: { majors: [{ name: "", school: { id: 0, name: "" } }] },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "majors",
  });

  return (
    <Form {...form}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="lg:max-w-4xl">
          <form
            className="grid h-full grid-rows-[auto,1fr,auto,auto]"
            onSubmit={form.handleSubmit(
              (d) => {
                onCreateHandler(d)
                  .then((response) => {
                    form.reset();
                    refetch();
                    setIsOpen(false);
                    toast({
                      title: "Success",
                      description: response.message,
                    });
                  })
                  .catch((errRes) => {
                    toast({
                      title: "Failed to create majors",
                      description: errRes.response.data.message,
                      variant: "destructive",
                    });
                  });
              },
              () => {
                toast({
                  title: "Invalid form data",
                  description: "Problem with majors data",
                  variant: "destructive",
                });
              },
            )}
          >
            <SheetHeader>
              <SheetTitle>Create majors</SheetTitle>
              <SheetDescription>
                Create multiple majors at once.
              </SheetDescription>
            </SheetHeader>
            <div className="my-2 flex flex-col gap-2 overflow-y-auto px-4 py-2">
              {fieldArray.fields.map((field, index) => {
                return (
                  <div
                    key={field.id}
                    className="rounded border-2 p-2 px-4 pb-4"
                  >
                    <p className="ml-auto w-fit rounded bg-gray-300 px-2 text-sm">
                      {field.id}
                    </p>
                    <Label>Name</Label>
                    <FormField
                      control={form.control}
                      name={`majors.${index}.name`}
                      render={({ field }) => (
                        <InputFormField
                          field={field}
                          errorField={
                            form.formState.errors
                              ? form.formState.errors.majors?.[index]?.name
                              : undefined
                          }
                          placeholder="Name"
                        />
                      )}
                    />
                    <Label>School</Label>
                    <FormField
                      control={form.control}
                      name={`majors.${index}.school`}
                      render={({ field }) => (
                        <SearchSelectFormField
                          id="school"
                          field={field}
                          errorField={
                            form.formState.errors
                              ? form.formState.errors.majors?.[index]?.school
                              : undefined
                          }
                          placeholder="Select School"
                          fetchResource={async (searchPhase) => {
                            return axiosInstance
                              .get(`/admin/schools`, {
                                params: { ["name:ilike"]: searchPhase },
                              })
                              .then((res) => {
                                return res.data.data.schools;
                              });
                          }}
                          optionLabel="name"
                          optionValue="id"
                          onSelected={function (value: School) {
                            field.onChange({ id: value.id, name: value.name });
                          }}
                        />
                      )}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() =>
                  fieldArray.append({ name: "", school: { id: 0, name: "" } })
                }
              >
                Add Major
              </Button>
              {fieldArray.fields.length > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    fieldArray.remove(fieldArray.fields.length - 1)
                  }
                >
                  Remove Last Major
                </Button>
              )}
            </div>
            <SheetFooter>
              <Button type="submit">Create</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </Form>
  );
}
