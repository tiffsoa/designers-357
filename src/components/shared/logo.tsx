import { Icons } from "./icons";

export default function Logo() {
    return (
      <div className="flex items-center gap-2">
        <Icons.eyeLogo className="h-10 w-10" />
        <h1 className="text-3xl font-bold">Visions</h1>
      </div>
    );
}