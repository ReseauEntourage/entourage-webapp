import Link from 'next/link'
import React from 'react'
import { Container, Label, InternalLink } from './NavItem.styles'

interface NavItemProps extends React.HTMLProps<HTMLDivElement> {
  href?: string;
  icon: JSX.Element;
  isActive?: boolean;
  label: string;
}

export function NavItem(props: NavItemProps) {
  const { label, icon, href, ...restProps } = props

  const content = (
    <Container {...restProps}>
      {icon}
      <Label>
        {label}
      </Label>
    </Container>
  )

  if (href) {
    return (
      <Link href={href}>
        <InternalLink>
          {content}
        </InternalLink>
      </Link>
    )
  }

  return content
}
