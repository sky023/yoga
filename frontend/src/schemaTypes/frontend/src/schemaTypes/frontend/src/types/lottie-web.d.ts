declare module 'lottie-web' {
  const lottie: {
    loadAnimation: (config: Record<string, unknown>) => {
      destroy: () => void
      setSpeed?: (speed: number) => void
    }
  }
  export default lottie
}
