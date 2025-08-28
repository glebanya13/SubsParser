# Subsparser - Telegram Channel Parser Tool

Subsparser is a powerful Telegram channel parser tool created by Gleb. It provides automated extraction of channel participants and members, exports data to Excel format with customizable columns, and offers comprehensive channel analytics.

## Features

### Channel parsing capabilities
- Extracts participants from public and private Telegram channels
- Supports various search filters (alphabetical, cyrillic, common patterns)
- Handles rate limiting and API restrictions automatically
- Processes multiple participant types (recent, admins, banned, kicked)

### Data export system
- Exports data to Excel format with ExcelJS
- Customizable output columns and formatting
- Structured data organization
- Automatic file naming and management

### Authentication & security
- Secure session-based authentication
- QR code and phone number login support
- API key management through environment variables
- Protection against duplicate data collection

## Technical implementation

- Built with Node.js and Telegram MTProto API (GramJS)
- Modular architecture with separate modules for:
  - Telegram client management
  - Participant extraction
  - Excel export functionality
  - Configuration management
- Uses environment-based configuration for:
  - API credentials
  - Target channel specification
  - Output file settings
- Features:
  - Comprehensive error handling
  - Rate limiting protection
  - Session persistence
  - Multi-language username support
- Operates with minimal external dependencies
