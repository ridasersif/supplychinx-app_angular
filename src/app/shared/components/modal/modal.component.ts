import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="close($event)">
      <div class="modal-container glass animate-zoom" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="text-gradient">{{ title }}</h3>
          <button class="btn-close" (click)="close()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
        <div class="modal-footer" *ngIf="showFooter">
          <ng-content select="[footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--s-6);
    }

    .modal-container {
      width: 100%;
      max-width: 550px;
      padding: 0;
      overflow: hidden;
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-premium);
      border: 1px solid var(--border-light);
    }

    .modal-header {
      padding: var(--s-6) var(--s-8);
      border-bottom: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-main);
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-main);
    }

    .btn-close {
      background: white;
      border: 1px solid var(--border-light);
      color: var(--text-muted);
      cursor: pointer;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-close:hover {
      background: var(--danger);
      color: white;
      border-color: var(--danger);
      transform: rotate(90deg);
    }

    .modal-body {
      padding: var(--s-8);
      max-height: 70vh;
      overflow-y: auto;
      color: var(--text-main);
      font-size: 0.9375rem;
      line-height: 1.6;
    }

    .modal-footer {
      padding: var(--s-5) var(--s-8);
      border-top: 1px solid var(--border-light);
      display: flex;
      justify-content: flex-end;
      gap: var(--s-4);
      background: var(--bg-main);
    }

    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .animate-zoom {
      animation: zoomIn 0.3s cubic-bezier(0.19, 1, 0.22, 1) forwards;
    }
  `]
})
export class ModalComponent {
  @Input() title: string = 'Modal Title';
  @Input() isOpen: boolean = false;
  @Input() showFooter: boolean = true;
  @Output() closed = new EventEmitter<void>();

  close(event?: MouseEvent): void {
    this.isOpen = false;
    this.closed.emit();
  }
}
