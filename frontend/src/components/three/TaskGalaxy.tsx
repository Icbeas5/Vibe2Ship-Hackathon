import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Task } from '../../types';
import { CenterStar } from './CenterStar';
import { GalaxyBackground } from './GalaxyBackground';
import { TaskPlanet } from './TaskPlanet';

interface TaskGalaxyProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (task: Task) => void;
}

export const TaskGalaxy = ({ tasks, selectedTaskId, onSelectTask }: TaskGalaxyProps) => {
  
  const getPriorityColor = (tier: string) => {
    switch (tier) {
      case 'critical': return '#FF7A45'; // Amber urgent
      case 'high': return '#F6AD55';     // Safety warning yellow
      case 'medium': return '#7C6FFF';   // Action violet
      default: return '#4FD1C5';         // Cool cyan stable status
    }
  };

  const getPlanetSize = (task: Task) => {
    // Scales based on subtask volume impact parameters
    const count = task.subtasks?.length || 1;
    return Math.min(0.08 + count * 0.025, 0.25);
  };

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing bg-space-900">
      <Canvas
        camera={{ position: [0, 5, 8], fov: 50 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <CenterStar />
        <GalaxyBackground />

        {tasks.filter(t => !t.isCompleted).map((task, index) => {
          // Logarithmic orbit radius computation based on timeline stress profiles
          const now = new Date().getTime();
          const target = new Date(task.deadline).getTime();
          const hoursLeft = Math.max((target - now) / (1000 * 60 * 60), 0.1);
          
          // Radius clamps tightly toward system center 'NOW' core as deadline matches zero
          const orbitRadius = Math.min(1.4 + Math.log2(hoursLeft + 1) * 0.75, 6.5);
          // Speed tracks faster inner velocities matching actual orbital dynamics formulas
          const orbitSpeed = 0.35 / (orbitRadius * 0.8);
          // Fixed uniform offset dispersion based on static ID hashing vectors
          const angleOffset = (index * (2 * Math.PI / Math.max(tasks.length, 1))) + (task.title.charCodeAt(0) * 0.05);

          return (
            <TaskPlanet
              key={task.id}
              task={task}
              orbitRadius={orbitRadius}
              orbitSpeed={orbitSpeed}
              angleOffset={angleOffset}
              color={getPriorityColor(task.priorityTier)}
              size={getPlanetSize(task)}
              isSelected={task.id === selectedTaskId}
              onSelect={() => onSelectTask(task)}
            />
          );
        })}

        <OrbitControls 
          enableZoom={true} 
          maxDistance={12} 
          minDistance={3}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 - 0.05} // Protect coordinate flipping under system grid base
        />
      </Canvas>

      {/* Decorative Telemetry Crosshairs Overlay */}
      <div className="absolute top-4 left-4 border-l border-t border-space-700/40 w-8 h-8 pointer-events-none" />
      <div className="absolute top-4 right-4 border-r border-t border-space-700/40 w-8 h-8 pointer-events-none" />
      <div className="absolute bottom-4 left-4 border-l border-b border-space-700/40 w-8 h-8 pointer-events-none" />
      <div className="absolute bottom-4 right-4 border-r border-b border-space-700/40 w-8 h-8 pointer-events-none" />
      
      <div className="absolute top-4 right-4 text-right pointer-events-none font-mono text-[9px] text-nova-telemetry/40">
        SYS.VIEW: QUAD_GALAXY_MAP<br />
        ORBITAL_MECHANICS: ENABLED
      </div>
    </div>
  );
};
