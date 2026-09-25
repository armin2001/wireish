import type { ComponentType } from 'react';
import { BookOpen, Bot, CalendarCheck, Database, Globe, Headset, Mail } from 'lucide-react';
import { FaFacebookMessenger, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import type { NodeKind } from '@/lib/canvas/model';

export const KIND_ICONS: Record<NodeKind, ComponentType<{ className?: string }>> = {
  website: Globe,
  instagram: FaInstagram,
  whatsapp: FaWhatsapp,
  messenger: FaFacebookMessenger,
  knowledge: BookOpen,
  agent: Bot,
  crm: Database,
  handoff: Headset,
  calendar: CalendarCheck,
  email: Mail,
};
