import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileList } from '../FileList';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

describe('FileList', () => {
  const mockFiles = [
    {
      _id: '1',
      name: 'test.txt',
      size: 1024,
      createdAt: new Date().toISOString()
    }
  ];

  const mockOnDelete = vi.fn();

  it('renders file list correctly', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <FileList files={mockFiles} onDelete={mockOnDelete} />
      </I18nextProvider>
    );

    expect(screen.getByText('test.txt')).toBeInTheDocument();
    expect(screen.getByText('1 KB')).toBeInTheDocument();
  });

  it('handles file deletion', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <FileList files={mockFiles} onDelete={mockOnDelete} />
      </I18nextProvider>
    );

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('displays empty state when no files', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <FileList files={[]} onDelete={mockOnDelete} />
      </I18nextProvider>
    );

    expect(screen.getByText('fileList.empty')).toBeInTheDocument();
  });
});