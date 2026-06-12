import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { AppUser, UserRole } from '../../models';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="page">
      <section class="users-hero">
        <div class="hero-overlay"></div>
        <div class="hero-inner">
          <h1 class="page-title">Gestión de Usuarios</h1>
          <p class="page-subtitle">Administra los accesos al catálogo privado de antigüedades.</p>
          <div class="hero-flourish" aria-hidden="true">⌘</div>

          <div class="stats-row">
            <article class="stat-card">
              <span class="stat-icon" aria-hidden="true">◎</span>
              <div><strong>{{ totalUsers() }}</strong><span>Usuarios totales</span></div>
            </article>
            <article class="stat-card">
              <span class="stat-icon" aria-hidden="true">♔</span>
              <div><strong>{{ adminCount() }}</strong><span>Administradores</span></div>
            </article>
            <article class="stat-card">
              <span class="stat-icon" aria-hidden="true">○</span>
              <div><strong>{{ collectorCount() }}</strong><span>Usuarios</span></div>
            </article>
            <article class="stat-card">
              <span class="stat-icon" aria-hidden="true">▦</span>
              <div><strong>{{ lastRegistrationLabel() }}</strong><span>Último registro</span></div>
            </article>
          </div>
        </div>
      </section>

      <main class="page-content">
        <div class="layout">
          <section class="form-panel">
            <h2 class="panel-title">
              <span aria-hidden="true">⌘</span>
              {{ editingUser() ? 'Editar usuario' : 'Crear nuevo usuario' }}
            </h2>

            @if (error()) {
              <div class="alert alert-error">{{ error() }}</div>
            }
            @if (success()) {
              <div class="alert alert-success">{{ success() }}</div>
            }

            <div class="form-group">
              <label class="form-label">Nombre completo</label>
              <input class="form-input" [(ngModel)]="formName" name="name" placeholder="Nombre del usuario" />
            </div>

            <div class="form-group">
              <label class="form-label">Correo electrónico</label>
              <input class="form-input" type="email" [(ngModel)]="formEmail" name="email" placeholder="correo@ejemplo.com" />
            </div>

            <div class="form-group">
              <label class="form-label">Contraseña{{ editingUser() ? ' (dejar en blanco para mantener)' : '' }}</label>
              <div class="password-field">
                <input
                  class="form-input"
                  [type]="showFormPassword() ? 'text' : 'password'"
                  [(ngModel)]="formPassword"
                  name="password"
                  [placeholder]="editingUser() ? 'Nueva contraseña' : 'Escribe una contraseña'"
                />
                <button class="field-icon-btn" type="button" (click)="showFormPassword.set(!showFormPassword())" aria-label="Mostrar u ocultar contraseña">
                  <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Rol</label>
              <select class="form-input form-select" [(ngModel)]="formRole" name="role">
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div class="form-actions">
              <button class="btn-submit" (click)="editingUser() ? updateUser() : createUser()" [disabled]="saving()">
                <span aria-hidden="true">{{ editingUser() ? '✓' : '+' }}</span>
                @if (saving()) { Guardando... } @else if (editingUser()) { Guardar cambios } @else { Crear usuario }
              </button>
              @if (editingUser()) {
                <button class="btn-cancel" (click)="cancelEdit()">Cancelar</button>
              }
            </div>
          </section>

          <section class="list-panel">
            <div class="list-header">
              <h2 class="panel-title">
                <span aria-hidden="true">◎</span>
                Usuarios registrados
              </h2>

              <div class="list-tools">
                <label class="search-box">
                  <span aria-hidden="true">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>
                  </span>
                  <input [(ngModel)]="searchTerm" placeholder="Buscar usuario..." />
                </label>
                <select class="role-filter" [(ngModel)]="roleFilter">
                  <option value="">Todos los roles</option>
                  <option value="admin">Administradores</option>
                  <option value="user">Usuarios</option>
                </select>
              </div>
            </div>

            @if (filteredUsers().length === 0) {
              <p class="empty">No hay usuarios con esos filtros.</p>
            } @else {
              <div class="users-table">
                <div class="table-row table-head">
                  <span>Usuario</span>
                  <span>Correo electrónico</span>
                  <span>Rol</span>
                  <span>Fecha registro</span>
                  <span>Acción</span>
                </div>

                @for (user of filteredUsers(); track user.id) {
                  <div class="table-row">
                    <div class="user-cell">
                      <span class="avatar">{{ initials(user.name) }}</span>
                      <div>
                        <strong>{{ user.name }}</strong>
                        <span>{{ user.role === 'admin' ? 'Administrador' : 'Usuario' }}</span>
                        <div class="user-pw-row">
                          <span class="user-pw-static">••••••••</span>
                        </div>
                      </div>
                    </div>
                    <span class="email-cell">{{ user.email }}</span>
                    <span><span class="role-pill">{{ user.role === 'admin' ? 'Administrador' : 'Usuario' }}</span></span>
                    <span class="date-cell">{{ user.createdAt | date:'d MMM y' }}</span>
                    <span class="row-actions">
                      <button class="icon-btn edit" (click)="editUser(user)" aria-label="Editar usuario">
                        <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>
                      </button>
                      <button class="icon-btn delete" (click)="deleteUser(user.id)" aria-label="Eliminar usuario">
                        <svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 15H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                      </button>
                    </span>
                  </div>
                }
              </div>
            }
          </section>
        </div>

        <div class="trust-strip">
          <div class="trust-item">
            <span class="trust-icon">✓</span>
            <div><strong>Acceso seguro</strong><span>Solo usuarios autorizados pueden acceder al catálogo privado.</span></div>
          </div>
          <div class="trust-item">
            <span class="trust-icon">▤</span>
            <div><strong>Control total</strong><span>Gestiona permisos y roles de forma sencilla.</span></div>
          </div>
          <div class="trust-item">
            <span class="trust-icon">▣</span>
            <div><strong>Datos protegidos</strong><span>La información de tus usuarios queda bajo control privado.</span></div>
          </div>
        </div>
      </main>

      @if (deleteTarget()) {
        <div class="modal-overlay" (click)="cancelDelete()">
          <div class="modal" (click)="$event.stopPropagation()">
            <h3 class="modal-title">Eliminar usuario</h3>
            <p class="modal-text">
              ¿Estás seguro de que deseas eliminar a <strong>{{ deleteTarget()?.name }}</strong>?
              <br/>Esta acción no se puede deshacer.
            </p>
            <div class="modal-actions">
              <button class="btn-cancel" (click)="cancelDelete()">Cancelar</button>
              <button class="btn-delete-confirm" (click)="confirmDelete()">Eliminar</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      background:
        radial-gradient(circle at 48% 0%, rgba(184, 149, 90, 0.15), transparent 30rem),
        linear-gradient(180deg, #050505 0%, #0b0b0a 48%, #10100f 100%);
      color: #f7efe3;
    }

    .users-hero {
      position: relative;
      overflow: hidden;
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.74)),
        url('/assets/login-bg-gallery.png') center 38% / cover no-repeat;
      border-bottom: 1px solid rgba(184, 149, 90, 0.28);
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(0,0,0,0.62), transparent 24%, transparent 72%, rgba(0,0,0,0.52)),
        radial-gradient(circle at 18% 35%, rgba(184,149,90,0.16), transparent 18rem);
      pointer-events: none;
    }

    .hero-inner {
      position: relative;
      z-index: 1;
      max-width: 1360px;
      margin: 0 auto;
      padding: 3rem 1.5rem 1.45rem;
    }

    .page-title {
      margin: 0;
      color: #fff8ed;
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.5rem, 4.4vw, 4rem);
      font-weight: 700;
      line-height: 1;
      text-shadow: 0 14px 34px rgba(0,0,0,0.56);
    }

    .page-subtitle {
      margin: 0.72rem 0 0;
      color: rgba(255,248,237,0.82);
      font-size: 1.08rem;
    }

    .hero-flourish {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      width: 150px;
      margin: 1rem 0 1.5rem;
      color: #d4ac62;
      font-family: Georgia, serif;
    }

    .hero-flourish::before,
    .hero-flourish::after {
      content: '';
      height: 1px;
      flex: 1;
      background: linear-gradient(90deg, transparent, rgba(212,172,98,0.9));
    }

    .hero-flourish::after {
      background: linear-gradient(90deg, rgba(212,172,98,0.9), transparent);
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
      max-width: 1060px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.1rem;
      min-height: 92px;
      padding: 1.1rem 1.25rem;
      border: 1px solid rgba(200,155,75,0.62);
      border-radius: 7px;
      background: linear-gradient(135deg, rgba(18,18,17,0.92), rgba(9,9,8,0.78));
      box-shadow: 0 18px 48px rgba(0,0,0,0.34);
    }

    .stat-icon {
      width: 46px;
      height: 46px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border: 1px solid rgba(212,172,98,0.72);
      border-radius: 50%;
      color: #d4ac62;
      font-size: 1.35rem;
    }

    .stat-card strong {
      display: block;
      color: #f2d292;
      font-family: 'Playfair Display', serif;
      font-size: 1.9rem;
      line-height: 1;
    }

    .stat-card div span {
      display: block;
      margin-top: 0.28rem;
      color: rgba(255,248,237,0.8);
      line-height: 1.2;
    }

    .page-content {
      max-width: 1360px;
      margin: 0 auto;
      padding: 1.35rem 1.5rem 3.4rem;
    }

    .layout {
      display: grid;
      grid-template-columns: minmax(340px, 0.46fr) minmax(0, 1fr);
      gap: 1rem;
      align-items: stretch;
    }

    .form-panel,
    .list-panel,
    .trust-strip {
      border: 1px solid rgba(184,149,90,0.34);
      border-radius: 8px;
      background:
        linear-gradient(180deg, rgba(18,18,17,0.93), rgba(9,9,8,0.9)),
        radial-gradient(circle at 0% 0%, rgba(184,149,90,0.08), transparent 16rem);
      box-shadow: 0 18px 48px rgba(0,0,0,0.25);
    }

    .form-panel {
      padding: 1.8rem;
    }

    .list-panel {
      padding: 1.35rem 1.55rem;
      min-width: 0;
    }

    .panel-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0 0 1.45rem;
      color: #fff8ed;
      font-family: 'Playfair Display', serif;
      font-size: 1.45rem;
      font-weight: 700;
    }

    .panel-title span {
      color: #d4ac62;
      font-family: Georgia, serif;
      font-size: 1.15rem;
    }

    .form-group {
      display: grid;
      gap: 0.45rem;
      margin-bottom: 1.1rem;
    }

    .form-label {
      color: #e5c98d;
      font-family: 'Playfair Display', serif;
      font-size: 0.96rem;
      font-weight: 600;
    }

    .form-input,
    .search-box,
    .role-filter {
      width: 100%;
      border: 1px solid rgba(184,149,90,0.36);
      border-radius: 5px;
      background: rgba(3,3,3,0.56);
      color: #fff8ed;
      outline: 0;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-input {
      min-height: 45px;
      padding: 0 0.9rem;
      font-size: 0.94rem;
    }

    .form-input::placeholder,
    .search-box input::placeholder {
      color: rgba(247,239,227,0.42);
    }

    .form-input:focus,
    .search-box:focus-within,
    .role-filter:focus {
      border-color: #d4ac62;
      box-shadow: 0 0 0 3px rgba(184,149,90,0.12);
    }

    .form-select,
    .role-filter {
      cursor: pointer;
    }

    .form-select option,
    .role-filter option {
      background: #11100f;
      color: #f7efe3;
    }

    .password-field {
      position: relative;
    }

    .password-field .form-input {
      padding-right: 3rem;
    }

    .field-icon-btn {
      position: absolute;
      top: 50%;
      right: 0.75rem;
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      border: 0;
      background: transparent;
      color: #d4ac62;
      cursor: pointer;
      transform: translateY(-50%);
    }

    .field-icon-btn svg,
    .search-box svg,
    .btn-eye svg,
    .icon-btn svg {
      width: 18px;
      height: 18px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.7;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.45rem;
    }

    .btn-submit,
    .btn-cancel {
      min-height: 48px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.55rem;
      border-radius: 5px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s, background 0.2s, border-color 0.2s;
    }

    .btn-submit {
      flex: 1;
      border: 1px solid rgba(212,172,98,0.9);
      background: linear-gradient(180deg, #c69842, #a97725);
      color: #fff8ed;
    }

    .btn-submit:hover:not(:disabled),
    .btn-cancel:hover {
      transform: translateY(-2px);
    }

    .btn-submit:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    .btn-cancel {
      padding: 0 1rem;
      border: 1px solid rgba(184,149,90,0.4);
      background: rgba(255,255,255,0.02);
      color: #d8bf91;
    }

    .alert {
      padding: 0.7rem 0.9rem;
      border-radius: 5px;
      margin-bottom: 1rem;
      font-size: 0.88rem;
    }

    .alert-error {
      background: rgba(184,84,80,0.12);
      border: 1px solid rgba(184,84,80,0.4);
      color: #ff9d95;
    }

    .alert-success {
      background: rgba(76,175,80,0.1);
      border: 1px solid rgba(76,175,80,0.34);
      color: #9bd79e;
    }

    .list-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .list-header .panel-title {
      margin-bottom: 0;
      white-space: nowrap;
    }

    .list-tools {
      display: flex;
      gap: 0.7rem;
      flex: 1;
      justify-content: flex-end;
      min-width: 0;
    }

    .search-box {
      max-width: 260px;
      min-height: 42px;
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0 0.8rem;
      color: #d4ac62;
    }

    .search-box input {
      min-width: 0;
      width: 100%;
      border: 0;
      background: transparent;
      color: #fff8ed;
      outline: 0;
    }

    .role-filter {
      width: 170px;
      min-height: 42px;
      padding: 0 0.8rem;
    }

    .users-table {
      overflow: visible;
    }

    .table-row {
      display: grid;
      grid-template-columns: minmax(155px, 1.1fr) minmax(160px, 1.15fr) minmax(112px, 0.72fr) minmax(104px, 0.62fr) 88px;
      gap: 0.75rem;
      align-items: center;
      padding: 0.95rem 0.45rem;
      border-bottom: 1px solid rgba(184,149,90,0.18);
    }

    .table-head {
      padding-top: 0.75rem;
      color: #d4ac62;
      font-size: 0.79rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-top: 1px solid rgba(184,149,90,0.22);
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      min-width: 0;
    }

    .user-cell > div {
      min-width: 0;
    }

    .avatar {
      width: 42px;
      height: 42px;
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      border: 1px solid rgba(212,172,98,0.72);
      border-radius: 50%;
      color: #d4ac62;
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      background: rgba(184,149,90,0.06);
    }

    .user-cell strong {
      display: block;
      color: #fff8ed;
      font-family: 'Playfair Display', serif;
      font-size: 1rem;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-cell div > span,
    .email-cell,
    .date-cell {
      color: rgba(247,239,227,0.78);
      font-size: 0.9rem;
      min-width: 0;
    }

    .email-cell,
    .date-cell {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-cell div > span {
      color: #d4ac62;
      font-size: 0.82rem;
    }

    .user-pw-row {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin-top: 0.08rem;
    }

    .user-pw-static {
      color: rgba(247,239,227,0.35);
      font-family: 'Courier New', monospace;
      font-size: 0.76rem;
      letter-spacing: 0.12em;
    }

    .btn-eye {
      width: 22px;
      height: 22px;
      display: inline-grid;
      place-items: center;
      border: 0;
      background: transparent;
      color: rgba(212,172,98,0.78);
      cursor: pointer;
    }

    .role-pill {
      display: inline-flex;
      min-height: 30px;
      align-items: center;
      justify-content: center;
      max-width: 100%;
      padding: 0 0.75rem;
      border: 1px solid rgba(184,149,90,0.62);
      border-radius: 999px;
      color: #e6c47d;
      background: rgba(184,149,90,0.06);
      font-size: 0.82rem;
      white-space: nowrap;
    }

    .row-actions {
      display: flex;
      gap: 0.45rem;
      justify-content: flex-end;
    }

    .icon-btn {
      width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      border-radius: 5px;
      background: transparent;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, transform 0.2s;
    }

    .icon-btn:hover {
      transform: translateY(-2px);
    }

    .icon-btn.edit {
      border: 1px solid rgba(184,149,90,0.58);
      color: #d4ac62;
    }

    .icon-btn.edit:hover {
      background: rgba(184,149,90,0.12);
      border-color: #d4ac62;
    }

    .icon-btn.delete {
      border: 1px solid rgba(196,53,46,0.5);
      color: #e24e48;
    }

    .icon-btn.delete:hover {
      background: rgba(196,53,46,0.12);
      border-color: #e24e48;
    }

    .empty {
      color: rgba(247,239,227,0.62);
      text-align: center;
      padding: 2.6rem 1rem;
    }

    .trust-strip {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      margin-top: 1rem;
      padding: 1.35rem 1.55rem;
    }

    .trust-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 0;
    }

    .trust-icon {
      width: 44px;
      height: 44px;
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      border: 1px solid rgba(212,172,98,0.58);
      color: #d4ac62;
      font-size: 1.1rem;
    }

    .trust-item strong {
      display: block;
      color: #e7c37c;
      font-family: 'Playfair Display', serif;
      font-size: 1.02rem;
      line-height: 1.2;
    }

    .trust-item div span {
      display: block;
      margin-top: 0.15rem;
      color: rgba(247,239,227,0.6);
      font-size: 0.84rem;
      line-height: 1.35;
    }

    @media (max-width: 1180px) {
      .stats-row {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .layout {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 760px) {
      .hero-inner,
      .page-content {
        padding-left: 1rem;
        padding-right: 1rem;
      }

      .page-title {
        font-size: clamp(2.2rem, 12vw, 3.2rem);
      }

      .stats-row,
      .trust-strip {
        grid-template-columns: 1fr;
      }

      .list-header,
      .list-tools,
      .form-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box,
      .role-filter {
        max-width: none;
        width: 100%;
      }

      .form-panel,
      .list-panel {
        padding: 1.15rem;
      }

      .table-row {
        grid-template-columns: 1fr;
        gap: 0.55rem;
        padding: 1rem 0.25rem;
      }

      .table-head {
        display: none;
      }

      .email-cell,
      .date-cell {
        padding-left: 54px;
      }

      .row-actions {
        justify-content: flex-start;
        padding-left: 54px;
      }

      .trust-item {
        align-items: flex-start;
      }
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
    .modal {
      background: #1c1b1a;
      border: 1px solid rgba(184,149,90,0.35);
      border-radius: 12px;
      padding: 2rem;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 24px 64px rgba(0,0,0,0.5);
      color: #f0e8db;
    }
    .modal-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.3rem;
      font-weight: 700;
      margin: 0 0 0.75rem;
      color: #f0e8db;
    }
    .modal-text {
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 0 0 1.5rem;
      color: rgba(240,232,219,0.8);
    }
    .modal-text strong {
      color: #f0e8db;
    }
    .modal-actions {
      display: flex;
      gap: 0.75rem;
    }
    .modal-actions .btn-cancel {
      flex: 1;
      background: transparent;
      border: 1px solid rgba(184,149,90,0.3);
      color: rgba(240,232,219,0.7);
      padding: 0.8rem;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .modal-actions .btn-cancel:hover {
      border-color: rgba(184,149,90,0.6);
      color: #f0e8db;
    }
    .btn-delete-confirm {
      flex: 1;
      background: #b85450;
      color: white;
      border: none;
      padding: 0.8rem;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-delete-confirm:hover {
      background: #d4605a;
    }
  `]
})
export class ManageUsersComponent {
  private auth = inject(AuthService);
  users = signal<AppUser[]>([]);
  saving = signal(false);
  error = signal('');
  success = signal('');
  editingUser = signal<AppUser | null>(null);
  showFormPassword = signal(false);

  deleteTarget = signal<AppUser | null>(null);

  searchTerm = signal('');
  roleFilter = signal('');
  formName = '';
  formEmail = '';
  formPassword = '';
  formRole: UserRole = 'user';

  filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.users().filter(user => {
      const matchesTerm = !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);
      const matchesRole = !this.roleFilter() || user.role === this.roleFilter();
      return matchesTerm && matchesRole;
    });
  });

  totalUsers = computed(() => this.users().length + 1);
  adminCount = computed(() => this.users().filter(user => user.role === 'admin').length + 1);
  collectorCount = computed(() => this.users().filter(user => user.role === 'user').length);

  constructor() {
    this.loadUsers().then();
  }

  lastRegistrationLabel(): string {
    const newest = this.users()
      .map(user => new Date(user.createdAt))
      .filter(date => !Number.isNaN(date.getTime()))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    return newest
      ? newest.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'Sin registros';
  }

  initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return (parts[0]?.[0] ?? 'U') + (parts[1]?.[0] ?? '');
  }

  editUser(user: AppUser) {
    this.editingUser.set(user);
    this.formName = user.name;
    this.formEmail = user.email;
    this.formPassword = '';
    this.formRole = user.role;
    this.error.set('');
    this.success.set('');
  }

  cancelEdit() {
    this.editingUser.set(null);
    this.formName = '';
    this.formEmail = '';
    this.formPassword = '';
    this.formRole = 'user';
    this.error.set('');
    this.success.set('');
  }

  private async loadUsers() {
    try {
      this.users.set(await this.auth.listUsers());
    } catch {
      this.error.set('Error al cargar usuarios.');
    }
  }

  async createUser() {
    this.error.set('');
    this.success.set('');
    if (!this.formName || !this.formEmail || !this.formPassword) {
      this.error.set('Todos los campos son obligatorios.');
      return;
    }
    this.saving.set(true);
    try {
      await this.auth.createUser(this.formEmail, this.formPassword, this.formName, this.formRole);
      this.success.set('Usuario creado correctamente.');
      this.formName = '';
      this.formEmail = '';
      this.formPassword = '';
      this.formRole = 'user';
      await this.loadUsers();
    } catch (err: any) {
      this.error.set(err?.error?.error ?? err?.message ?? 'Error al crear usuario.');
    } finally {
      this.saving.set(false);
    }
  }

  async updateUser() {
    this.error.set('');
    this.success.set('');
    const user = this.editingUser();
    if (!user) return;
    if (!this.formName || !this.formEmail) {
      this.error.set('Nombre y correo son obligatorios.');
      return;
    }
    this.saving.set(true);
    try {
      const data: { name: string; email: string; role: UserRole; password?: string } = {
        name: this.formName,
        email: this.formEmail,
        role: this.formRole,
      };
      if (this.formPassword) data.password = this.formPassword;
      await this.auth.updateUser(user.id, data);
      this.success.set('Usuario actualizado correctamente.');
      this.cancelEdit();
      await this.loadUsers();
    } catch (err: any) {
      this.error.set(err?.error?.error ?? err?.message ?? 'Error al actualizar usuario.');
    } finally {
      this.saving.set(false);
    }
  }

  async deleteUser(id: string) {
    const user = this.users().find(u => u.id === id);
    if (user) this.deleteTarget.set(user);
  }

  cancelDelete() {
    this.deleteTarget.set(null);
  }

  async confirmDelete() {
    const user = this.deleteTarget();
    if (!user) return;
    this.deleteTarget.set(null);
    try {
      await this.auth.deleteUser(user.id);
      await this.loadUsers();
    } catch (err: any) {
      this.error.set(err?.error?.error ?? err?.message ?? 'Error al eliminar usuario.');
    }
  }
}
