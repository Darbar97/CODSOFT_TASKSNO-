import React from 'react';
import {
  Code2,
  Sparkles,
  Landmark,
  Film,
  Brain,
  Globe,
  BookOpen,
  Palette,
  HelpCircle,
  Trophy,
  Flame,
  Clock,
  Compass,
  Zap,
  CheckCircle2,
  Award
} from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Code2':
      return <Code2 className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Landmark':
      return <Landmark className={className} />;
    case 'Film':
      return <Film className={className} />;
    case 'Brain':
      return <Brain className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} />;
    case 'Award':
      return <Award className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
