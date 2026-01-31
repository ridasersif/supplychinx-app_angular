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
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 24px;
    }

    .modal-container {
      width: 100%;
      max-width: 550px;
      padding: 0;
      overflow: hidden;
      border-radius: var(--radius-xl);
      border: 1px solid rgba(255, 255, 255, 0.4);
    }

    .modal-header {
      padding: 24px 32px;
      border-bottom: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.5);
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 800;
    }

    .btn-close {
      background: #f1f5f9;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-close:hover {
      background: var(--danger);
      color: white;
      transform: rotate(90deg);
    }

    .modal-body {
      padding: 32px;
      max-height: 70vh;
      overflow-y: auto;
      color: var(--text-main);
    }

    .modal-footer {
      padding: 20px 32px;
      border-top: 1px solid var(--border-light);
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      background: rgba(248, 250, 252, 0.5);
    }

    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.9) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .animate-zoom {
      animation: zoomIn 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
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
