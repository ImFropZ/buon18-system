"use client";

import { Button } from "@components/ui/button";
import { Form, FormField } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Client, ClientEditSchema } from "@models/client";
import { useNavigation, useOne, useUpdate } from "@refinedev/core";
import { Check, Eye, List, Plus, Trash2, Undo2 } from "lucide-react";
import { SocialMedia as SheetSocialMedia } from "@components/sheet/SocialMedia";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { InputFormField } from "@components/form";
import { CustomTooltip } from "@components";

const ClientEdit = ({ params }: { params: { id: string } }) => {
  const { mutate } = useUpdate<Client>();
  const { data, isLoading } = useOne<Client>({
    resource: "clients",
    id: params.id,
  });
  const { show, list } = useNavigation();
  const form = useForm<Client>({
    resolver: zodResolver(ClientEditSchema),
  });
  const { append, update, fields, remove } = useFieldArray({
    control: form.control,
    name: "social_medias",
    keyName: "uuid",
  });
  const [socialMediaDeleteIds, setSocialMediaDeleteIds] = React.useState<
    number[]
  >([]);

  const onSubmit = (data: Client) => {
    mutate(
      {
        id: params.id,
        resource: "clients",
        values: {
          ...data,
          delete_social_media_ids: socialMediaDeleteIds,
        },
      },
      {
        onSuccess: () => show("clients", params.id),
      },
    );
  };

  return (
    <Sheet>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative flex h-full flex-col overflow-hidden rounded-lg px-1 pb-2"
        >
          <div className="flex gap-2">
            <CustomTooltip content="Client List">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => list("clients")}
              >
                <List />
              </Button>
            </CustomTooltip>
            <CustomTooltip content="View Client">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => show("clients", params.id)}
                className="ml-auto"
              >
                <Eye />
              </Button>
            </CustomTooltip>
            <CustomTooltip content="Confirm">
              <Button
                type="submit"
                size="icon"
                variant="outline"
                className="hover:bg-green-500 hover:text-secondary"
              >
                <Check />
              </Button>
            </CustomTooltip>
          </div>
          {isLoading ? (
            <div className="grid place-content-center pt-10">
              <div className="loader" aria-label="loader"></div>
            </div>
          ) : (
            <div className="grid flex-1 grid-cols-[1fr,1fr] gap-5 pt-2">
              <div className="h-full overflow-hidden rounded-2xl outline outline-[2px] outline-muted">
                <div className="flex justify-between bg-primary p-4 text-2xl font-bold text-secondary">
                  <p>Client</p>
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <InputFormField
                        field={field}
                        defaultValue={data?.data.code || ""}
                        errorField={form.formState.errors.code}
                      />
                    )}
                  />
                </div>
                <div className="p-2">
                  <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                    <h2 className="scroll-m-20 px-2 font-bold tracking-tight lg:text-xl">
                      Name:
                    </h2>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <InputFormField
                          field={field}
                          defaultValue={data?.data.name || ""}
                          errorField={form.formState.errors.name}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="p-2">
                  <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                    <h2 className="scroll-m-20 px-2 font-bold tracking-tight lg:text-xl">
                      Address:
                    </h2>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <InputFormField
                          field={field}
                          defaultValue={data?.data.address || ""}
                          errorField={form.formState.errors.address}
                          placeholder="No Address"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="p-2">
                  <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                    <h2 className="scroll-m-20 px-2 font-bold tracking-tight lg:text-xl">
                      Phone:
                    </h2>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <InputFormField
                          field={field}
                          defaultValue={data?.data.phone || ""}
                          errorField={form.formState.errors.phone}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="p-2">
                  <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                    <h2 className="scroll-m-20 px-2 font-bold tracking-tight lg:text-xl">
                      Latitude
                    </h2>
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <InputFormField
                          field={field}
                          defaultValue={data?.data.latitude + "" || ""}
                          errorField={form.formState.errors.latitude}
                          placeholder="Client Latitude"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="p-2">
                  <div className="grid grid-cols-2 items-center border-b-2 pb-2">
                    <h2 className="scroll-m-20 px-2 font-bold tracking-tight lg:text-xl">
                      Longtitude
                    </h2>
                    <FormField
                      control={form.control}
                      name="longtitude"
                      render={({ field }) => (
                        <InputFormField
                          field={field}
                          defaultValue={data?.data.longitude + "" || ""}
                          errorField={form.formState.errors.longitude}
                          placeholder="Client Longtitude"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="scroll-m-20 font-extrabold tracking-tight lg:text-xl">
                    Social Media
                  </h2>
                  <SheetTrigger asChild>
                    <Button className="flex items-center gap-2" type="button">
                      <Plus />
                      <span>Add Social Media</span>
                    </Button>
                  </SheetTrigger>
                </div>
                <div className="flex flex-col gap-3">
                  {data?.data.social_medias.map((socialMedia, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        onChange={(e) => {
                          const i = fields.findIndex(
                            (sm) => sm.id == socialMedia.id,
                          );

                          if (i !== -1) {
                            update(i, {
                              ...fields[i],
                              platform: e.target.value,
                            });
                            return;
                          }

                          append({
                            id: socialMedia.id,
                            platform: e.target.value,
                            url: socialMedia.url,
                          });
                        }}
                        disabled={socialMediaDeleteIds.includes(
                          Number(socialMedia.id),
                        )}
                        className="text-primary"
                        defaultValue={socialMedia.platform || ""}
                      />
                      <Input
                        onChange={(e) => {
                          const i = fields.findIndex(
                            (sm) => sm.id == socialMedia.id,
                          );

                          if (i !== -1) {
                            update(i, {
                              ...fields[i],
                              url: e.target.value,
                            });
                            return;
                          }

                          append({
                            id: socialMedia.id,
                            platform: e.target.value,
                            url: e.target.value,
                          });
                        }}
                        disabled={socialMediaDeleteIds.includes(
                          Number(socialMedia.id),
                        )}
                        className="text-primary"
                        defaultValue={socialMedia.url || ""}
                      />
                      {socialMediaDeleteIds.includes(Number(socialMedia.id)) ? (
                        <Button
                          type="button"
                          size="icon"
                          className="aspect-square"
                          variant="ghost"
                          onClick={() => {
                            if (socialMedia.id) {
                              setSocialMediaDeleteIds((prev) =>
                                prev.filter(
                                  (id) => id !== Number(socialMedia.id),
                                ),
                              );
                            }
                          }}
                        >
                          <Undo2 />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="icon"
                          className="aspect-square"
                          variant="destructive"
                          onClick={() => {
                            if (socialMedia.id) {
                              setSocialMediaDeleteIds((prev) => [
                                ...prev,
                                Number(socialMedia.id),
                              ]);
                            }
                          }}
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </div>
                  ))}
                  {fields
                    .filter((sm) => !sm.id)
                    .map((socialMedia, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          onChange={(e) => {
                            update(index, {
                              ...socialMedia,
                              platform: e.target.value,
                            });
                          }}
                          className="text-primary"
                          defaultValue={socialMedia.platform || ""}
                        />
                        <Input
                          onChange={(e) => {
                            update(index, {
                              ...socialMedia,
                              url: e.target.value,
                            });
                          }}
                          className="text-primary"
                          defaultValue={socialMedia.url || ""}
                        />
                        <Button
                          type="button"
                          size="icon"
                          className="aspect-square"
                          variant="destructive"
                          onClick={() => {
                            remove(
                              fields.findIndex((sm) => sm.id == socialMedia.id),
                            );
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>
      <SheetSocialMedia
        onSubmit={(data) => {
          append(data);
        }}
      />
    </Sheet>
  );
};

export default ClientEdit;
