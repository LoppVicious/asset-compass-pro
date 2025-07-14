import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button Component', () => {
  it('renders with default variant', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    
    const button = getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('renders with different variants', () => {
    const { getByRole, rerender } = render(<Button variant="secondary">Secondary</Button>);
    
    let button = getByRole('button');
    expect(button).toHaveClass('bg-secondary');

    rerender(<Button variant="destructive">Destructive</Button>);
    button = getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('renders with different sizes', () => {
    const { getByRole, rerender } = render(<Button size="sm">Small</Button>);
    
    let button = getByRole('button');
    expect(button).toHaveClass('h-8');

    rerender(<Button size="lg">Large</Button>);
    button = getByRole('button');
    expect(button).toHaveClass('h-10');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    const { getByRole } = render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = getByRole('button', { name: 'Click me' });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>);
    
    const button = getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none');
  });

  it('applies custom className', () => {
    const { getByRole } = render(<Button className="custom-class">Custom</Button>);
    
    const button = getByRole('button', { name: 'Custom' });
    expect(button).toHaveClass('custom-class');
  });
});