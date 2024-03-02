import { DialogBody } from "@material-tailwind/react";
import clsx from "clsx";
import { X } from "react-feather";

interface GenericDialogProps {
  isOpen: boolean;
  onToggle: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}


export function GenericDialog({ isOpen, onToggle, title, children, className, ...rest }: GenericDialogProps) {
  return (
    <>
      {isOpen && (
        <div
          className={clsx(['bg-white border-2 p-1 shadow-md rounded-md', className])}
          {...rest}
        >
          <div className='flex items-center justify-between'>
            {title}
            <X className='m-1 cursor-pointer' onClick={onToggle} />
          </div>
          <DialogBody className="p-0">
            {children}
          </DialogBody>
        </div>
      )}
    </>
  );
}
