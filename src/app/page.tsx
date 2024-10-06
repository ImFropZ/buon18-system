import { Authenticated } from "@refinedev/core";
import { installedModules } from "@modules";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import Link from "next/link";

export default function IndexPage() {
  return (
    <Authenticated key="home-page">
      <div className="mx-auto my-20 grid max-w-[92rem] grid-cols-[repeat(auto-fill,minmax(0,128px))] place-content-center place-items-center gap-10">
        {installedModules.map((m) => {
          return (
            <div
              key={m.module.manifest.name}
              className="flex flex-col items-center gap-2"
            >
              <Link href={m.module.manifest.rootPath}>
                <Avatar className="h-16 w-16 rounded-lg outline-2 outline-gray-600 hover:outline">
                  <AvatarImage
                    src={m.module.manifest.icon}
                    alt={m.module.manifest.name}
                  />
                  <AvatarFallback>
                    {m.module.manifest.displayName}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <p className="text-center">{m.module.manifest.displayName}</p>
            </div>
          );
        })}
      </div>
    </Authenticated>
  );
}
