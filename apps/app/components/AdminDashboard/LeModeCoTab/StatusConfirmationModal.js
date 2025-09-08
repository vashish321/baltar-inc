import React from 'react';
import styles from './StatusConfirmationModal.module.css';

const StatusConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  subscription, 
  newStatus, 
  isLoading 
}) => {
  if (!isOpen) return null;

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'PENDING': return 'Pending Payment';
      case 'PAID': return 'Paid';
      case 'FAILED': return 'Payment Failed';
      case 'COMPLIMENTARY': return 'Complimentary';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#ffc107';
      case 'PAID': return '#28a745';
      case 'FAILED': return '#dc3545';
      case 'COMPLIMENTARY': return '#17a2b8';
      case 'CANCELLED': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const isPaymentConfirmation = newStatus === 'PAID';

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>
            {isPaymentConfirmation ? 'Confirm Payment' : 'Update Subscription Status'}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.subscriptionDetails}>
            <h4>Subscription Details</h4>
            <div className={styles.detailRow}>
              <span className={styles.label}>Customer:</span>
              <span className={styles.value}>{subscription.fullName}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{subscription.email}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Package:</span>
              <span className={styles.value}>{subscription.package.name}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Amount:</span>
              <span className={styles.value}>${subscription.monthlyAmount}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Current Status:</span>
              <span 
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(subscription.status) }}
              >
                {getStatusDisplayName(subscription.status)}
              </span>
            </div>
          </div>

          <div className={styles.statusChange}>
            <div className={styles.statusChangeHeader}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Change status to:</span>
            </div>
            <span 
              className={styles.newStatusBadge}
              style={{ backgroundColor: getStatusColor(newStatus) }}
            >
              {getStatusDisplayName(newStatus)}
            </span>
          </div>

          {isPaymentConfirmation && (
            <div className={styles.warningBox}>
              <div className={styles.warningHeader}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Important</span>
              </div>
              <p>
                Are you sure you want to mark this subscription as <strong>PAID</strong>? 
                This will allow orders to be shipped for this customer.
              </p>
            </div>
          )}

          <div className={styles.confirmationText}>
            <p>
              {isPaymentConfirmation 
                ? 'Please confirm that payment has been received for this subscription.'
                : `Are you sure you want to change the status to ${getStatusDisplayName(newStatus)}?`
              }
            </p>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className={styles.confirmButton} 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className={styles.spinner}>
                <div className={styles.spinnerIcon}></div>
                <span>Updating...</span>
              </div>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Confirm
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusConfirmationModal;
