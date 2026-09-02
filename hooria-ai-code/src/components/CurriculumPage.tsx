import { Link } from '@tanstack/react-router';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	ArrowLeft,
	Sparkles,
	Rocket,
	BookOpen,
	Cpu,
	Database,
	Bot,
	Workflow,
	Server,
	Trophy,
	Presentation,
	Clock,
	Users,
	GraduationCap,
	Check,
	MessagesSquare,
	Zap,
	BrainCircuit,
	Code2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { programDetails } from '@/data/program-details';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	Sparkles,
	BookOpen,
	Cpu,
	Database,
	Bot,
	Workflow,
	Server,
	Trophy,
	Presentation,
	GraduationCap,
	Rocket,
	Zap,
	BrainCircuit,
	Code2,
};

function Reveal({
	children,
	className,
	delay = 0,
}: {
	children: ReactNode;
	className?: string;
	delay?: number;
}) {
	const [visible, setVisible] = useState(false);
	const [ref, setRef] = useState<HTMLDivElement | null>(null);
	useEffect(() => {
		if (!ref) return;
		const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.12 });
		io.observe(ref);
		return () => io.disconnect();
	}, [ref]);
	return (
		<div
			ref={setRef}
			style={{ transitionDelay: `${delay}ms` }}
			className={`transition-all duration-700 ease-out ${
				visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
			} ${className ?? ''}`}>
			{children}
		</div>
	);
}

type Session = { title: string; points: string[] };
type Module = {
	id: string;
	n: string;
	weeks: string;
	title: string;
	icon: string;
	intro?: string | null;
	sessions: Session[];
	deliverable?: string | null;
};
type CurriculumRow = {
	id: string;
	title: string;
	subtitle: string | null;
	description: string | null;
	duration: string | null;
	prerequisites: string | null;
	class_duration: string | null;
	qa_session: string | null;
};

async function fetchCurriculum(slug: string): Promise<CurriculumRow | null> {
	const { data, error } = await supabase
		.from('curriculums')
		.select('id, title, subtitle, description, duration, prerequisites, class_duration, qa_session')
		.eq('slug', slug)
		.eq('is_published', true)
		.maybeSingle();
	if (error) throw error;
	return data;
}

async function fetchModules(curriculumId: string): Promise<Module[]> {
	const { data, error } = await supabase
		.from('curriculum_modules')
		.select('*')
		.eq('curriculum_id', curriculumId)
		.order('sort_order', { ascending: true });
	if (error) throw error;
	return (data ?? []).map(row => ({
		id: row.id,
		n: row.module_number,
		weeks: row.weeks,
		title: row.title,
		icon: row.icon,
		intro: row.intro,
		sessions: Array.isArray(row.sessions) ? (row.sessions as unknown as Session[]) : [],
		deliverable: row.deliverable,
	}));
}

const defaultPortfolioOut = [
	'Prompt Engineering Library',
	'Deployed PDF Summarizer API',
	'"Chat With Your Documents" RAG App',
	'Autonomous Research Agent',
	'Business Process Automation Workflow',
	'Capstone Project (team-built, demo-recorded)',
];

function usefulText(value: string | null | undefined, fallback: string, minimumLength = 1) {
	const normalized = value?.trim();
	return normalized && normalized.length >= minimumLength ? normalized : fallback;
}

export function CurriculumPage({ slug }: { slug: string }) {
	const fallback = programDetails[slug];
	const { data: curriculum, isLoading: curriculumLoading } = useQuery({
		queryKey: ['curriculum', slug],
		queryFn: () => fetchCurriculum(slug),
	});
	const { data: modules = [], isLoading: modulesLoading } = useQuery({
		queryKey: ['curriculum-modules', curriculum?.id],
		queryFn: () => fetchModules(curriculum?.id as string),
		enabled: !!curriculum?.id,
	});

	const displayedCurriculum = useMemo(
		() =>
			curriculum
				? {
						...curriculum,
						title: fallback ? usefulText(curriculum.title, fallback.curriculum.title, 12) : curriculum.title,
						subtitle: fallback
							? usefulText(curriculum.subtitle, fallback.curriculum.subtitle, 12)
							: curriculum.subtitle,
						description: fallback
							? usefulText(curriculum.description, fallback.curriculum.description, 40)
							: curriculum.description,
						duration: fallback
							? usefulText(curriculum.duration, fallback.curriculum.duration)
							: curriculum.duration,
						prerequisites: fallback
							? usefulText(curriculum.prerequisites, fallback.curriculum.prerequisites)
							: curriculum.prerequisites,
						class_duration: fallback
							? usefulText(curriculum.class_duration, fallback.curriculum.class_duration)
							: curriculum.class_duration,
						qa_session: fallback
							? usefulText(curriculum.qa_session, fallback.curriculum.qa_session)
							: curriculum.qa_session,
					}
				: fallback
					? {
							id: `fallback-${slug}`,
							...fallback.curriculum,
						}
					: null,
		[curriculum, fallback, slug],
	);

	const hasDetailedDatabaseModules = modules.some(
		module => module.sessions.length > 0 || Boolean(module.deliverable?.trim()),
	);
	const displayedModules = hasDetailedDatabaseModules ? modules : (fallback?.modules ?? modules);
	const portfolioOut = fallback?.portfolio ?? defaultPortfolioOut;

	useEffect(() => {
		if (displayedCurriculum) {
			document.title = `${displayedCurriculum.title} — Hooria AI`;
		}
	}, [displayedCurriculum]);

	if (curriculumLoading) {
		return (
			<div className='min-h-screen bg-background px-4 py-24'>
				<div className='mx-auto max-w-5xl'>
					<div className='h-64 rounded-2xl border border-border/60 bg-surface/50 animate-pulse' />
				</div>
			</div>
		);
	}

	if (!displayedCurriculum) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-background px-4'>
				<div className='max-w-sm text-center'>
					<h1 className='text-xl font-bold'>Curriculum not available</h1>
					<p className='mt-2 text-sm text-muted-foreground'>
						This curriculum doesn't exist or isn't published right now.
					</p>
					<Link
						to='/'
						className='mt-6 inline-flex items-center gap-2 text-sm text-brand-blue hover:underline'>
						<ArrowLeft className='h-4 w-4' /> Back to home
					</Link>
				</div>
			</div>
		);
	}

	const snapshotItems = [
		displayedCurriculum.duration && {
			icon: Clock,
			label: 'Duration',
			value: displayedCurriculum.duration,
		},
		displayedCurriculum.class_duration && {
			icon: Users,
			label: 'Class Duration',
			value: displayedCurriculum.class_duration,
		},
		displayedCurriculum.prerequisites && {
			icon: BookOpen,
			label: 'Prerequisite',
			value: displayedCurriculum.prerequisites,
		},
		displayedCurriculum.qa_session && {
			icon: MessagesSquare,
			label: 'Q&A Session',
			value: displayedCurriculum.qa_session,
		},
	].filter((x): x is { icon: typeof Clock; label: string; value: string } => Boolean(x));

	return (
		<div className='min-h-screen bg-background text-foreground'>
			{/* Hero */}
			<section className='relative overflow-hidden border-b border-border/40'>
				<div className='absolute inset-0 bg-hero-glow opacity-70' aria-hidden />
				<div className='relative mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28'>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition'>
						<ArrowLeft className='h-4 w-4' /> Back to home
					</Link>
					<Reveal>
						<div className='mt-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-3.5 py-1.5 text-xs sm:text-sm text-muted-foreground backdrop-blur'>
							<Rocket className='h-3.5 w-3.5 text-brand-blue' />
							Live Cohort Program
						</div>
					</Reveal>
					<Reveal delay={100}>
						<h1 className='mt-6 text-4xl sm:text-6xl font-bold tracking-tight'>
							{displayedCurriculum.title}
						</h1>
					</Reveal>
					{displayedCurriculum.subtitle && (
						<Reveal delay={150}>
							<p className='mt-3 text-lg sm:text-xl text-muted-foreground'>{displayedCurriculum.subtitle}</p>
						</Reveal>
					)}
					{displayedCurriculum.description && (
						<Reveal delay={200}>
							<p className='mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed'>
								{displayedCurriculum.description}
							</p>
						</Reveal>
					)}
				</div>
			</section>

			{/* Snapshot */}
			{snapshotItems.length > 0 && (
				<section className='py-16 sm:py-20 border-b border-border/40 bg-surface/30'>
					<div className='mx-auto max-w-5xl px-4 sm:px-6'>
						<Reveal>
							<p className='text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue'>
								Program Snapshot
							</p>
							<h2 className='mt-2 text-2xl sm:text-3xl font-bold'>Everything you need to know</h2>
						</Reveal>
						<div className='mt-10 grid gap-4 sm:grid-cols-2'>
							{snapshotItems.map((s, i) => (
								<Reveal key={s.label} delay={i * 60}>
									<div className='h-full rounded-2xl border border-border/60 bg-background/60 p-5 flex gap-4'>
										<div className='grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue'>
											<s.icon className='h-5 w-5' />
										</div>
										<div>
											<div className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
												{s.label}
											</div>
											<div className='mt-1 text-sm sm:text-base text-foreground leading-snug'>{s.value}</div>
										</div>
									</div>
								</Reveal>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Weekly Curriculum */}
			<section className='py-20 sm:py-28'>
				<div className='mx-auto max-w-5xl px-4 sm:px-6'>
					<Reveal className='text-center max-w-2xl mx-auto'>
						<p className='text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue'>Curriculum Map</p>
						<h2 className='mt-3 text-3xl sm:text-4xl font-bold'>Week by week, session by session</h2>
						<p className='mt-4 text-muted-foreground'>
							{displayedModules.length > 0
								? `${displayedModules.length} module${displayedModules.length === 1 ? '' : 's'}. Every session is a live build. Every module ends with a shippable artifact.`
								: 'Modules for this program are coming soon.'}
						</p>
					</Reveal>

					<div className='mt-16 space-y-6'>
						{modulesLoading &&
							displayedModules.length === 0 &&
							Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className='h-40 rounded-2xl border border-border/60 bg-surface/50 animate-pulse'
								/>
							))}
						{displayedModules.map((m, i) => {
							const Icon = iconMap[m.icon] ?? Sparkles;
							return (
								<Reveal key={m.id} delay={i * 40}>
									<article className='relative rounded-2xl border border-border/60 bg-surface/60 p-6 sm:p-8 hover:border-brand-violet/50 transition'>
										<div className='flex flex-col sm:flex-row sm:items-start gap-5'>
											<div className='flex sm:flex-col items-center sm:items-start gap-4 sm:gap-3 sm:w-40 shrink-0'>
												<div className='grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand shadow-brand'>
													<Icon className='h-6 w-6 text-primary-foreground' />
												</div>
												<div>
													<div className='font-display text-2xl font-bold text-gradient-brand'>
														Module {m.n}
													</div>
													<div className='text-xs font-mono uppercase tracking-wider text-muted-foreground mt-0.5'>
														{m.weeks}
													</div>
												</div>
											</div>

											<div className='flex-1 min-w-0'>
												<h3 className='text-xl sm:text-2xl font-bold'>{m.title}</h3>
												{m.intro && (
													<p className='mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed'>
														{m.intro}
													</p>
												)}
												<div className='mt-5 space-y-5'>
													{m.sessions.map(s => (
														<div key={s.title}>
															<h4 className='text-sm sm:text-base font-semibold text-foreground'>
																{s.title}
															</h4>
															<ul className='mt-2 space-y-1.5'>
																{s.points.map(p => (
																	<li
																		key={p}
																		className='flex gap-2.5 text-sm text-muted-foreground leading-relaxed'>
																		<Check className='mt-0.5 h-4 w-4 shrink-0 text-brand-blue' />
																		<span>{p}</span>
																	</li>
																))}
															</ul>
														</div>
													))}
												</div>
												{m.deliverable && (
													<div className='mt-5 rounded-xl border border-brand-violet/40 bg-brand-violet/10 px-4 py-3 text-sm'>
														<span className='font-semibold text-brand-glow'>Deliverable · </span>
														<span className='text-foreground/90'>{m.deliverable}</span>
													</div>
												)}
											</div>
										</div>
									</article>
								</Reveal>
							);
						})}
					</div>
				</div>
			</section>

			{/* Portfolio outcome */}
			<section className='py-20 sm:py-24 border-t border-border/40 bg-surface/30'>
				<div className='mx-auto max-w-5xl px-4 sm:px-6'>
					<Reveal className='text-center max-w-2xl mx-auto'>
						<p className='text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue'>Portfolio</p>
						<h2 className='mt-3 text-3xl sm:text-4xl font-bold'>What you'll walk away with</h2>
						<p className='mt-4 text-muted-foreground'>
							You'll leave with a production-grade portfolio that proves you can build modern AI applications.
						</p>
					</Reveal>

					<div className='mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{portfolioOut.map((p, i) => (
							<Reveal key={p} delay={i * 50}>
								<div className='flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-4'>
									<div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-violet/10 text-brand-violet'>
										<Check className='h-4 w-4' />
									</div>
									<span className='text-sm font-medium'>{p}</span>
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* Footer CTA */}
			<section className='py-20 sm:py-32'>
				<div className='mx-auto max-w-5xl px-4 sm:px-6 text-center'>
					<Reveal>
						<h2 className='text-3xl sm:text-5xl font-bold tracking-tight'>
							Ready to build the <span className='text-gradient-brand'>future?</span>
						</h2>
						<p className='mt-6 text-lg text-muted-foreground max-w-2xl mx-auto'>
							Don't just prompt — engineer. Join the next cohort and master the technical skills that matter.
						</p>
						<div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4'>
							<Link
								to='/'
								className='w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background transition hover:bg-foreground/90 hover:scale-105 active:scale-95'>
								Apply for Next Cohort
							</Link>
							<Link
								to='/'
								className='w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-4 text-sm font-semibold text-foreground transition hover:bg-surface hover:border-border/80'>
								Talk to an Advisor
							</Link>
						</div>
					</Reveal>
				</div>
			</section>

			{/* Bottom Nav Spacer */}
			<div className='h-20 sm:h-0' />
		</div>
	);
}
