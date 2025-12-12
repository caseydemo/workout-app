import { render, screen } from '@testing-library/react';
import TopNav from '../TopNav';

describe('TopNav', () => {
  it('renders the page title', () => {
    render(<TopNav />);
    expect(screen.getByText('Workout App')).toBeInTheDocument();
  });

  it('renders the logo', () => {
    render(<TopNav />);
    expect(screen.getByText('💪')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<TopNav />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Cardio')).toBeInTheDocument();
    expect(screen.getByText('Strength')).toBeInTheDocument();
    expect(screen.getByText('Nutrition')).toBeInTheDocument();
  });

  it('has correct href attributes for links', () => {
    render(<TopNav />);
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Cardio').closest('a')).toHaveAttribute('href', '/cardio');
    expect(screen.getByText('Strength').closest('a')).toHaveAttribute('href', '/strength');
    expect(screen.getByText('Nutrition').closest('a')).toHaveAttribute('href', '/nutrition');
  });

  it('renders nav element with correct class', () => {
    const { container } = render(<TopNav />);
    expect(container.querySelector('nav')).toBeInTheDocument();
  });
});
