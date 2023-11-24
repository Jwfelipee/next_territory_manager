import { Toaster } from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';

import NotFound from "@/pages/not-found";
import { SpiralLoader } from "@/ui/spiral";

function Loading() {
  return (
    <main>
      <section className='bg-gray-50'>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
          <SpiralLoader />
        </div>
      </section>
    </main>
  );
}

export type Mode = 'loading' | 'screen' | 'not-found';

export const RootModeScreen = ({ children, mode = 'loading' }: {
  children: React.ReactNode;
  mode: Mode;
}) => {
  const projectVersion = 'v1.1.0';
  return (
    <>
      <Toaster />
      {mode === 'loading' && <Loading />}
      {mode === 'screen' && children}
      {mode === 'not-found' && <NotFound />}
      <div
        className="fixed bottom-0 left-0 p-1 m-1 bg-gray-400 text-white text-sm rounded"
        data-tip=" 
        "
        id="versionTooltip"
      >
        Versão: {projectVersion}
      </div>
      <Tooltip
        anchorSelect="#versionTooltip"
        openOnClick={true}
        place="top"
      >
        Versão 1.1.0
      </Tooltip>
    </>
  );
};