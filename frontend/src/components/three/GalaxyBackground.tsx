import { Stars } from '@react-three/drei';

export const GalaxyBackground = () => {
  return (
    <Stars 
      radius={100} 
      depth={50} 
      count={1500} 
      factor={6} 
      saturation={0.5} 
      fade 
      speed={1} 
    />
  );
};
