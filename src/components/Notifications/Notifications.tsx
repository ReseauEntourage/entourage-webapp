import Snackbar from '@material-ui/core/Snackbar'
import { Alert } from '@material-ui/lab'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { notificationsActions, selectAlerts, selectAlertToShow } from 'src/core/useCases/notifications'
import { texts } from 'src/i18n'

export function Notifications() {
  const dispatch = useDispatch()
  const alerts = useSelector(selectAlerts)
  const alertToShow = useSelector(selectAlertToShow)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (alerts.length && !alertToShow) {
      dispatch(notificationsActions.shiftAndShowAlert())
      setOpen(true)
    } else if (alerts.length && alertToShow && open) {
      setOpen(false)
    }
  }, [alertToShow, alerts.length, dispatch, open])

  const handleClose = (
    event: React.SyntheticEvent | MouseEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const handleExited = () => {
    dispatch(notificationsActions.hideAlert())
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={3000}
      onClose={handleClose}
      open={open}
      TransitionProps={{ onExited: handleExited }}
    >
      <Alert onClose={handleClose} severity={alertToShow?.severity}>
        {/*
          // TODO To use when we will have custom messages
          {alertToShow?.message}
        */}
        {texts.labels.error}
      </Alert>
    </Snackbar>
  )
}
