# PayPal Subscription Component

A production-ready React component for handling PayPal subscription payments with comprehensive security, error handling, and user experience features.

## Features

### 🔒 Security
- Input validation and sanitization
- XSS protection through proper data handling
- Secure API communication with request validation
- No sensitive data exposure in logs or errors

### 🛡️ Error Handling
- Comprehensive error catching and user feedback
- Graceful degradation for network issues
- Proper error boundaries and recovery mechanisms
- User-friendly error messages in Spanish

### 🎯 User Experience
- Loading states and progress indicators
- Real-time feedback for user actions
- Accessible design with proper ARIA attributes
- Responsive layout and styling

### 🔧 Developer Experience
- Full TypeScript support with strict typing
- Comprehensive JSDoc documentation
- Extensive test coverage (unit and integration)
- Clean, maintainable code structure

## Installation

The component uses the following dependencies:

```bash
npm install @paypal/react-paypal-js
```

## Environment Variables

Set up the following environment variables:

```env
# Development
PAYPAL_CLIENT_ID_DEV=your_paypal_dev_client_id

# Production
PAYPAL_CLIENT_ID=your_paypal_prod_client_id
```

## Usage

```tsx
import PayPal from './pages/Payment/PayPal/Subscription';

function MyComponent() {
  const handleSubscriptionComplete = () => {
    console.log('Subscription completed successfully!');
    // Handle post-subscription logic
  };

  return (
    <PayPal 
      plan="1" 
      onComplete={handleSubscriptionComplete} 
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `plan` | `string` | Yes | Payment plan identifier (must be '1', '2', or '3') |
| `onComplete` | `() => void` | Yes | Callback function called when subscription is completed |

## Valid Payment Plans

The component accepts the following payment plan identifiers:
- `"1"` - Basic plan
- `"2"` - Standard plan  
- `"3"` - Premium plan

These should match the plans configured in your PayPal business account.

## API Integration

The component integrates with two backend API endpoints:

### Create Subscription
- **Endpoint**: `/api/v1/paypal-create-subscription`
- **Method**: POST
- **Payload**:
  ```json
  {
    "plan": "1",
    "timestamp": 1234567890,
    "validated": true
  }
  ```

### Capture Subscription
- **Endpoint**: `/api/v1/paypal-capture-subscription`
- **Method**: POST
- **Payload**:
  ```json
  {
    "subscriptionId": "subscription_id_from_paypal",
    "timestamp": 1234567890,
    "validated": true
  }
  ```

## Error Handling

The component handles various error scenarios:

### Configuration Errors
- Missing PayPal client ID
- Invalid environment configuration

### Validation Errors
- Invalid payment plan
- Malformed subscription data
- Security validation failures

### API Errors
- Network connectivity issues
- Backend service errors
- PayPal service errors

### User Errors
- Transaction cancellation
- Payment method issues

## Security Considerations

### Input Validation
- All user inputs are validated and sanitized
- Payment plans are restricted to predefined values
- Subscription IDs are validated for format and content

### Data Protection
- No sensitive payment data is stored locally
- API requests include validation flags
- Error messages don't expose internal system details

### XSS Prevention
- All user inputs are properly escaped
- Dynamic content is safely rendered
- No direct HTML injection

## Testing

Run the test suite:

```bash
# Unit tests
npm test PayPal/Subscription

# Integration tests
npm test PayPal/Subscription/integration

# Coverage report
npm test -- --coverage PayPal/Subscription
```

### Test Coverage
- ✅ Component rendering
- ✅ Props validation
- ✅ Payment plan validation
- ✅ Subscription creation flow
- ✅ Approval handling
- ✅ Error scenarios
- ✅ Loading states
- ✅ Security validation
- ✅ Environment configuration
- ✅ Accessibility features

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance

- Lazy loading of PayPal SDK
- Minimal re-renders with React.memo patterns
- Efficient state management
- Optimized bundle size

## Accessibility

- WCAG 2.1 AA compliant
- Screen reader friendly
- Keyboard navigation support
- High contrast mode support

## Troubleshooting

### Common Issues

1. **Configuration Error**
   - Ensure PayPal client IDs are set in environment variables
   - Verify the correct environment (dev/prod) configuration

2. **Invalid Payment Plan**
   - Check that the plan prop matches valid values ('1', '2', '3')
   - Ensure plans are configured in PayPal business account

3. **API Errors**
   - Verify backend endpoints are accessible
   - Check API response format matches expected structure

4. **Network Issues**
   - Component handles offline scenarios gracefully
   - Retry mechanisms are built-in for transient failures

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('paypal-debug', 'true');
```

## Contributing

When contributing to this component:

1. Maintain TypeScript strict mode compliance
2. Add tests for new functionality
3. Update documentation for API changes
4. Follow security best practices
5. Ensure accessibility standards are met

## License

This component is part of the Easy Online English application and follows the project's licensing terms.
