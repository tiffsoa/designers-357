import {Icons} from "@/components/shared/icons";

export function WelcomeBanner() {
  return (
    <div className="bg-primary text-background rounded-xl p-8 mb-8 mt-8 ml-30 mr-30 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute -top-10 -right-10 size-40 rounded-full bg-primary-foreground" />
        <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-primary-foreground" />
        <div className="absolute top-1/2 left-1/3 size-24 rounded-full bg-primary-foreground" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-primary-foreground/20 px-3 py-1">
            <Icons.trendingUpIcon className="size-3.5 text-primary-foreground" />
            <span className="text-xs font-semibold text-primary-foreground">
              On track
            </span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-background lg:text-3xl text-balance">
          Hey Sarah, welcome back to your Visions dashboard!
        </h1>
        <p className="text-sm text-primary-foreground/80 max-w-md leading-relaxed">
          Big goals start with small habits. Check in on your visions today and
          keep that momentum going.
        </p>
      </div>
    </div>
  );
}