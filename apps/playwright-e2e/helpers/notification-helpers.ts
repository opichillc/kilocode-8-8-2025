// kilocode_change - new file
import { type Page } from "@playwright/test"

/**
 * Closes all visible notification toasts in VSCode
 * @param page - The Playwright page instance
 * @param timeout - Maximum time to wait for notifications
 */
export async function closeAllToastNotifications(page: Page, timeout: number = 0): Promise<void> {
	try {
		// Look for notifications specifically in the notification container/area
		// This is more specific than just looking for .notification-list-item anywhere
		const notificationContainer = page.locator(
			".notifications-center, .notification-toast-container, .notifications-list",
		)
		const containerExists = (await notificationContainer.count()) > 0
		if (!containerExists) {
			return
		}

		const notificationItems = notificationContainer.locator(".notification-list-item")
		const notificationCount = await notificationItems.count()
		if (notificationCount === 0) {
			return
		}

		console.log(`🔍 Found ${notificationCount} notifications in container to close...`)

		// Close notifications by hovering and clicking their close buttons
		for (let i = 0; i < notificationCount; i++) {
			const notification = notificationItems.nth(i)
			const isVisible = await notification.isVisible().catch(() => false)
			if (isVisible) {
				await notification.hover()
				const closeButton = notification.locator(".codicon-notifications-clear")
				const closeButtonExists = (await closeButton.count()) > 0
				if (closeButtonExists) {
					await closeButton.click()
					console.log(`✅ Closed notification #${i}`)
				}
			}
		}
	} catch (_error) {
		return
	}
}
