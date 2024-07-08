"use client";

import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SocialMedia as TSocialMedia, SocialMediaSchema } from "@models";
import React from "react";
import { useForm } from "react-hook-form";

interface SocialMediaProps {
  onSubmit: (data: TSocialMedia) => void;
  socialMedia?: TSocialMedia;
}

export const SocialMedia = ({ onSubmit, socialMedia }: SocialMediaProps) => {
  const form = useForm<TSocialMedia>({
    resolver: zodResolver(SocialMediaSchema),
    defaultValues: {
      id: undefined,
      platform: socialMedia?.platform,
      url: socialMedia?.url,
    },
  });

  return (
    <Form {...form}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add new social media</SheetTitle>
          <SheetDescription>
            Enter the social media information to add a new social media
          </SheetDescription>
        </SheetHeader>
        <form
          className="mt-5 flex flex-col gap-5"
          onSubmit={form.handleSubmit((data) => {
            onSubmit(data);
            form.reset();
          })}
        >
          <FormLabel>Platform</FormLabel>
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="text-primary"
                    defaultValue={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormLabel>Link or URL</FormLabel>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="text-primary"
                    defaultValue={field.value || ""}
                    type="url"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SheetClose asChild>
            <Button type="submit">Save</Button>
          </SheetClose>
        </form>
      </SheetContent>
    </Form>
  );
};
