import emailjs from '@emailjs/browser'

export async function sendFoundPetNotification({
  to_email,
  to_name,
  pet_name,
  pet_type,
  location,
  finderName = 'Someone'
}: {
  to_email: string
  to_name: string
  pet_name: string
  pet_type: string
  location: string
  finderName?: string
}) {
  const templateParams = {
    to_email,
    to_name,
    subject: `Great News! ${pet_name} Has Been Found!`,
    pet_name,
    pet_type,
    location,
    finder_name: finderName,
    message: `Great news! ${finderName} has reported finding ${pet_name} near ${location}. Please check your PetAlert dashboard for details and contact information.`
  }

  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
    )
    console.log('Found pet notification sent successfully')
  } catch (error) {
    console.error('Failed to send found pet notification:', error)
    throw error
  }
}

export async function sendNearbyPetAlert({
  to_email,
  to_name,
  pet_name,
  pet_type,
  location,
  alert_url
}: {
  to_email: string
  to_name: string
  pet_name: string
  pet_type: string
  location: string
  alert_url: string
}) {
  const templateParams = {
    to_email,
    to_name,
    subject: `Pet Alert: ${pet_name} is Missing Near You`,
    pet_name,
    pet_type,
    location,
    alert_url,
    message: `A ${pet_type} named ${pet_name} has gone missing near ${location}. You're receiving this because you're in the area. Please keep an eye out and report any sightings.`
  }

  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
    )
    console.log('Nearby pet alert sent successfully')
  } catch (error) {
    console.error('Failed to send nearby pet alert:', error)
    throw error
  }
}

// Simple browser notification for immediate alerts
export function showBrowserNotification(title: string, body: string, icon?: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      tag: 'pet-alert'
    })
  }
}

export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    return Notification.requestPermission()
  }
  return Promise.resolve(Notification.permission)
}