import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileUpload } from '../FileUpload';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

describe('FileUpload', () => {
  const mockOnUpload = vi.fn();

  it('renders upload component correctly', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <FileUpload onUpload={mockOnUpload} />
      </I18nextProvider>
    );

    expect(screen.getByText('fileUpload.clickToUpload')).toBeInTheDocument();
    expect(screen.getByText('fileUpload.dragDrop')).toBeInTheDocument();
  });

  it('handles file upload', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <FileUpload onUpload={mockOnUpload} />
      </I18nextProvider>
    );

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]');

    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
    }

    expect(mockOnUpload).toHaveBeenCalledWith(file);
  });

  it('disables upload when in progress', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <FileUpload onUpload={mockOnUpload} disabled={true} />
      </I18nextProvider>
    );

    const input = screen.getByRole('button').querySelector('input[type="file"]');
    expect(input).toBeDisabled();
  });
});