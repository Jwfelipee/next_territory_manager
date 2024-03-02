import clsx from "clsx";

export function Body({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <>
      <div
        className={clsx("flex flex-col w-full h-full", className)}
        {...rest}
      >
        {children}
      </div>
    </>
  );
}
