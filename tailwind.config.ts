import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'brand': ['DM Serif Display', 'serif'],
				'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
				'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.01em' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0.01em' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '0.01em' }],
			},
			colors: {
				// CERANOS Design System Colors - Apple-refined
				'bg-base': 'hsl(var(--bg-base))',
				'bg-panel': 'hsl(var(--bg-panel))',
				'bg-elevated': 'hsl(var(--bg-elevated))',
				'text-primary': 'hsl(var(--text-primary))',
				'text-secondary': 'hsl(var(--text-secondary))',
				'text-tertiary': 'hsl(var(--text-tertiary))',
				'border-line': 'hsl(var(--border-line))',
				'border-subtle': 'hsl(var(--border-subtle))',
				'accent-blue': 'hsl(var(--accent-blue))',
				'accent-blue-subtle': 'hsl(var(--accent-blue-subtle))',
				'focus-ring': 'hsl(var(--focus-ring))',
				'state-positive': 'hsl(var(--state-positive))',
				'state-negative': 'hsl(var(--state-negative))',
				'state-warning': 'hsl(var(--state-warning))',

				// Legacy shadcn compatibility
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				'none': '0px',
				'xs': '4px',
				'sm': '6px',
				DEFAULT: '8px',
				'md': '10px',
				'lg': '12px',
				'xl': '16px',
				'2xl': '20px',
				'full': '9999px'
			},
			boxShadow: {
				'sm': 'var(--shadow-sm)',
				'md': 'var(--shadow-md)',
				'lg': 'var(--shadow-lg)',
				'xl': 'var(--shadow-xl)',
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
			},
			transitionDuration: {
				'120': '120ms',
				'140': '140ms',
				'160': '160ms'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'loading-dot': {
					'0%, 80%, 100%': {
						transform: 'scale(0)',
						opacity: '0.5'
					},
					'40%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'loading-dot': 'loading-dot 1.4s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.3s ease-out'
			},
			animationDelay: {
				'0': '0ms',
				'100': '100ms',
				'200': '200ms',
				'300': '300ms'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
