import Link from 'next/link'
import React from 'react'
import * as S from './NavItem.styles'

interface NavItemProps extends React.HTMLProps<HTMLDivElement> {
  href?: string;
  icon: JSX.Element;
  isActive?: boolean;
  label: string;
}

export function NavItem(props: NavItemProps) {
  const { label, icon, href, isActive, ...restProps } = props

  const content = (
    <S.Container {...restProps}>
      <S.ActiveContainer isActive={isActive}>
        {icon}
        <S.Label>
          {label}
        </S.Label>
      </S.ActiveContainer>
    </S.Container>
  )

  if (href) {
    return (
      <Link href={href}>
        <S.InternalLink>
          {content}
        </S.InternalLink>
      </Link>
    )
  }

  return content
}
