import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BookingPage } from './BookingPage';

describe('BookingPage', () => {
  it('should display loading state and then render events with their slots', async () => {
    // 1. Render the component and destructure the query functions from the result.
    const { getByText, findByText, queryByText } = render(
      <BookingPage bookerId="test-booker" />
    );

    // 2. Assert that the initial loading message is displayed
    expect(getByText('Loading events...')).toBeInTheDocument();

    // 3. Wait for the event card title to appear. This confirms the first API call worked.
    expect(await findByText('30 Minute Stand-up')).toBeInTheDocument();

    // 4. Wait for a slot button to appear. This confirms the second API call (for slots) worked.
    // This is the key change to fix the race condition.
    expect(await findByText('10:00')).toBeInTheDocument();

    // 5. Now that we've awaited the first slot, we know the others should be present.
    expect(getByText('10:30')).toBeInTheDocument();

    // 6. Assert that events with no slots are NOT rendered.
    expect(queryByText('1 Hour Consultation')).not.toBeInTheDocument();

    // 7. Assert the loading message is gone.
    expect(queryByText('Loading events...')).not.toBeInTheDocument();
  });
});