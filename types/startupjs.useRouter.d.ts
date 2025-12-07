declare module 'startupjs/useRouter' {
  export default function useRouter (): {
    navigate: (to: string) => void
    push: (to: string) => void
    replace: (to: string) => void
    usePathname: () => string
  }
}
