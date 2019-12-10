import { styled } from '@material-ui/core/styles'
import Link from 'next/link'
import React from 'react'

const Container = styled('div')(({ theme }) => ({
  margin: theme.spacing(2),
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
}))

const Label = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(1),
}))

const InternalLink = styled('a')(() => ({
  textDecoration: 'none',
}))

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
