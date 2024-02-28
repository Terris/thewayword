import { Loader } from "./Loader";

export function LoadingScreen() {
  return (
    <div className="fixed z-50 inset-0 bg-background bg-opacity-25 flex items-center justify-center">
      <Loader />
    </div>
  );
}
