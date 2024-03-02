import clsx from "clsx"

interface IconContainerCopyProps extends React.ComponentPropsWithoutRef<'div'> {
  icon: React.ReactNode
}

export const IconContainer = ({ icon, className, ...rest }: IconContainerCopyProps) => {
  return (
    <div className={clsx(['p-1 cursor-pointer', className])} {...rest}>
      {icon}
    </div>
  )
}