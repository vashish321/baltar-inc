import React, { useState, useEffect } from 'react';
import { getApiEndpoint } from '@/lib/config';
import styles from './TemplateApplyModal.module.css';

const TemplateApplyModal = ({ orderId, onClose, onRefresh }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(getApiEndpoint('/api/le-mode-co/admin/templates'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      setApplying(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(
        getApiEndpoint(`/api/le-mode-co/admin/orders/${orderId}/apply-template`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ templateId: selectedTemplate.id })
        }
      );

      if (response.ok) {
        onRefresh();
        onClose();
      } else {
        const error = await response.json();
        alert('Failed to apply template: ' + (error.details || error.error));
      }
    } catch (error) {
      console.error('Error applying template:', error);
      alert('Failed to apply template');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Apply Template to Order</h3>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.loading}>Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className={styles.emptyState}>
              <h4>No Templates Available</h4>
              <p>Create templates in the Template Management section to quickly populate orders.</p>
            </div>
          ) : (
            <div className={styles.templatesGrid}>
              {templates.map(template => (
                <div
                  key={template.id}
                  className={`${styles.templateCard} ${
                    selectedTemplate?.id === template.id ? styles.selected : ''
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className={styles.templateHeader}>
                    <h4>{template.name}</h4>
                    <div className={styles.templateMeta}>
                      <span className={styles.itemCount}>
                        {template.items?.length || 0} items
                      </span>
                      <span className={styles.templateValue}>
                        ${template.totalValue ? template.totalValue.toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>

                  {template.description && (
                    <div className={styles.templateDescription}>
                      {template.description}
                    </div>
                  )}

                  <div className={styles.templateItems}>
                    <h5>Items in this template:</h5>
                    <div className={styles.itemsList}>
                      {template.items?.slice(0, 3).map((item, index) => (
                        <div key={index} className={styles.templateItem}>
                          <span className={styles.itemName}>{item.itemName}</span>
                          {item.quantity && (
                            <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                          )}
                        </div>
                      ))}
                      {template.items?.length > 3 && (
                        <div className={styles.moreItems}>
                          +{template.items.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedTemplate?.id === template.id && (
                    <div className={styles.selectedBadge}>
                      ✓ Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectedTemplate && (
            <div className={styles.selectedTemplate}>
              <h4>Selected Template: {selectedTemplate.name}</h4>
              <p>This will add {selectedTemplate.items?.length || 0} items to the order.</p>
              <div className={styles.warningNote}>
                <strong>Note:</strong> Applying a template will add items to the existing order. 
                It will not replace current items.
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.applyButton}
            onClick={applyTemplate}
            disabled={!selectedTemplate || applying}
          >
            {applying ? 'Applying...' : 'Apply Template'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateApplyModal;
