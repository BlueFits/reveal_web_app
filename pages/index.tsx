import Link from 'next/link'

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/a" as="/a">
          Test deployment
        </Link>
      </li>
      <li>
        <Link href="/b" as="/b">
          b
        </Link>
      </li>
    </ul>
  )
}
