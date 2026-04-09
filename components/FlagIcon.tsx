const FLAG_MAP: Record<string, { src: string; alt: string }> = {
  en: { src: 'https://flagcdn.com/w40/gb.png', alt: 'English' },
  ms: { src: 'https://flagcdn.com/w40/my.png', alt: 'Malay' },
  zh: { src: 'https://flagcdn.com/w40/cn.png', alt: 'Chinese' },
}

export default function FlagIcon({ lang, size = 16 }: { lang: string; size?: number }) {
  const flag = FLAG_MAP[lang]
  if (!flag) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flag.src}
      alt={flag.alt}
      width={size}
      height={size}
      className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size }}
    />
  )
}
