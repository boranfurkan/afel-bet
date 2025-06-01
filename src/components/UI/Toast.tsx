'use client';

import { Toaster as SonnerToaster } from 'sonner';

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      closeButton
      richColors
      expand
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group bg-[#171717]/90 backdrop-blur-sm border-[#a0c380] text-white font-supply text-sm',
          title: 'text-white text-base font-bold',
          description: 'text-white/80 text-sm',
          actionButton: 'bg-[#a0c380] text-black',
          cancelButton: 'bg-[#171717] text-white',
          closeButton: 'text-white bg-[#333]',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
