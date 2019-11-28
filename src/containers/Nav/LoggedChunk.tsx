import React, { useCallback } from 'react'
import { refetchQuery } from 'react-query'
import Avatar from '@material-ui/core/Avatar'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { queryKeys } from 'src/network/queries'
import { setTokenIntoCookies, createAnonymousUser } from 'src/network/services'

interface LoggedChunkProps {}

export function LoggedChunk(/* props: LoggedChunkProps */) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const logout = useCallback(async () => {
    setTokenIntoCookies('')
    await createAnonymousUser()
    refetchQuery(queryKeys.me, { force: true })
  }, [])

  return (
    <>
      <div
        aria-controls="simple-menu"
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyUp={handleClick}
        style={{
          outline: 'none',
        }}
      >
        <Avatar alt="John Doe" src="https://i.pravatar.cc/100" />
      </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted={true}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {/* <MenuItem onClick={handleClose}>
          Profile
        </MenuItem> */}
        <MenuItem onClick={logout}>
          Se déconnecter
        </MenuItem>
      </Menu>
    </>
  )
}
