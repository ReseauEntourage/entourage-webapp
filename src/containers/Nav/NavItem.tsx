import Link from 'next/link'
import React from 'react'
import { Link as CustomLink } from 'src/components/Link'
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
        <CustomLink>
          {content}
        </CustomLink>
      </Link>
    )
  }

  return content
}
