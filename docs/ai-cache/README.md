# AI Knowledge Cache
> Pre-computed knowledge for AI assistants working on Clean Up Bros codebase
> Last Updated: 2026-01-22

## Purpose
This folder contains structured inventories of the codebase to help AI assistants quickly understand the system without re-exploring files every session.

## Files

| File | Description |
|------|-------------|
| `forms-inventory.md` | All forms, their fields, and webhook endpoints |
| `services-inventory.md` | All backend services and their responsibilities |
| `webhooks-inventory.md` | All N8N webhook URLs and their purposes |
| `notification-channels.md` | Email, SMS, WhatsApp, Telegram configuration |

## Usage
Before any task involving forms, webhooks, or notifications, read the relevant inventory file first.

## Update Policy
- Update after any structural changes to forms or services
- Update webhook URLs if N8N endpoints change
- Update notification channels if credentials or integrations change
