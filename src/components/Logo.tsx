import { Leaf } from 'lucide-react';
import type { FC } from 'react';

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 text-primary ${className}`}>
      <Leaf size={28} />
      <span className="text-2xl font-bold font-headline">CocoWise</span>
    </div>
  );
};

export default Logo;
