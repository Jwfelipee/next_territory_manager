import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import { useState } from 'react';
import { Map, X } from 'react-feather';

export function DialogMap({ title, children }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <div className='absolute top-0 right-0 m-6 z-20'>

      <Map onClick={handleOpen} id='overseer-image' fill="none" className='text-primary cursor-pointer' />

      <Dialog open={open} handler={handleOpen}>
        <div className='flex justify-between'>
          <DialogHeader>{title}</DialogHeader>
          <X className='m-4 cursor-pointer' onClick={handleOpen} />
        </div>
        <DialogBody>
          {children}
        </DialogBody>
      </Dialog>
    </div>
  );
}