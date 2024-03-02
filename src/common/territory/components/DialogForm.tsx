import { Dialog, DialogBody, DialogHeader, Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { X } from 'react-feather';

import { SimpleRegistrationForm } from '@/components/Organisms/SimpleRegistrationForm';

import { Mode } from '@/common/loading';
import { streetGateway } from '@/infra/Gateway/StreetGateway';

export function DialogForm({ open, setOpen, blockOptions, territory, getData }) {
  const [isLoading, setIsLoading] = useState<Mode>('loading');
  const [addressOptions, setAddressOptions] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClosed = () => {
    setOpen(false);
    getData()
  }
  const [house, setHouse] = useState({
    form: {
      addressId: '',
      number: '',
      legend: '',
      dontVisit: '',
      block: '',
      territory: territory.id,
      houseId: ''
    }
  });

  useEffect(() => {
    getStreetData()

    return () => {
      setIsLoading('loading')
      setHouse({
        form: {
          addressId: '',
          number: '',
          legend: '',
          dontVisit: '',
          block: '',
          territory: territory.id,
          houseId: ''
        }
      })
    }
  }, [open])

  async function getStreetData() {
    setIsLoading('loading')
    await streetGateway.getAll(territory.id).then((result) => {
      setAddressOptions(result.data)
    })

    if (!isNaN(+String(open))) {
      await streetGateway.getHouseById(open).then((result) => {
        setHouse({
          form: {
            addressId: result.data.address.id,
            number: result.data.number,
            legend: result.data.legend,
            dontVisit: result.data.dontVisit,
            block: result.data.block.name,
            territory: territory.id,
            houseId: open
          }
        })
      })
    }

    setIsLoading('screen')
  }

  return (
    <div className='absolute top-0 right-0 m-6 z-20'>
      {isLoading === 'screen' && (
        <Dialog open={open} handler={handleOpen}>
          <div className='flex justify-between'>
            <DialogHeader>
              <div className="flex gap-2 p-2">
                <Typography variant="h5" color="blue-gray">
                  {territory.name}
                </Typography>
              </div>
            </DialogHeader>
            <X className='m-4 cursor-pointer' onClick={handleClosed} />
          </div>
          <DialogBody>
            <SimpleRegistrationForm blockOptions={blockOptions} form={house.form} addressOptions={addressOptions} handleClosed={handleClosed} />
          </DialogBody>
        </Dialog >
      )}
    </div >
  );
}