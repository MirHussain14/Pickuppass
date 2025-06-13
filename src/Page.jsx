import React, { useState, useEffect } from "react";
import { Heading, TextArea, Button, Icon, Text } from "@vibe/core";

const Page = () => {
  const [status, setStatus] = useState('');
  const [itemId, setItemId] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasValidParams, setHasValidParams] = useState(false);

  // Webhook URLs
  const EMAIL_WEBHOOK = 'https://hook.us1.make.com/cc89un731l8itpovk0ycc88uf4zye2hr';
  const COMMENT_WEBHOOK = 'https://hook.us1.make.com/ertwhj6nhxntfpw2gvwv70ragfsox88e';

  // Function to post to email webhook on initial load
  const postToEmailWebhook = async (statusParam, itemIdParam) => {
    try {
      const emailData = {
        status: statusParam,
        itemId: itemIdParam,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        action: 'page_load'
      };

      const response = await fetch(EMAIL_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        console.error('Failed to post to email webhook:', response.statusText);
      } else {
        // console.log('Successfully posted to email webhook');
      }
    } catch (error) {
      console.error('Error posting to email webhook:', error);
    }
  };

  useEffect(() => {
    // Get status and item ID from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const statusParam = urlParams.get('status');
    const itemIdParam = urlParams.get('itemId');
    
    // Only proceed if both parameters are present
    if (statusParam && itemIdParam) {
      setStatus(statusParam);
      setItemId(itemIdParam);
      setHasValidParams(true);
      
      // Post to email webhook as soon as valid params are found
      postToEmailWebhook(statusParam, itemIdParam);
    } else {
      setHasValidParams(false);
    }
  }, []);

  const submitFeedback = async () => {
    setIsLoading(true);
    
    const commentData = {
      itemId: itemId,
      feedback: feedback,
      status: status,
      timestamp: new Date().toISOString(),
      feedbackType: isNegativeStatus ? 'improvement' : 'testimonial',
      userAgent: navigator.userAgent,
      url: window.location.href,
      action: 'feedback_submit'
    };

    try {
      const response = await fetch(COMMENT_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFeedback('');
        }, 3000);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('There was an error submitting your feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render the form if required parameters are missing
  if (!hasValidParams) {
    return (
      <div className="error-container">
        <div className="error-card">
          <div className="error-icon">
            <Icon iconType="fa" icon="exclamation-triangle" iconSize="48" />
          </div>
          <Heading type="h2" size="medium" align="center">Invalid Access</Heading>
          <Text align="center" className="error-text">
            This page requires valid status and itemId parameters to load.
          </Text>
          <Text size="small" color="secondary" align="center" className="error-subtext">
            Please access this page through the proper link with required parameters.
          </Text>
          <div className="error-example">
            <Text size="small" color="secondary" align="center">
              Example: ?status=good&itemId=123
            </Text>
          </div>
        </div>
      </div>
    );
  }

  const isNegativeStatus = status === 'negative' || status === 'bad' || status === 'poor' || status == 'Rejected';
  const isPositiveStatus = status === 'good' || status === 'positive' || status == 'Approved';

  return (
    <>
      <div className="feedback-container">
        <div className="feedback-card">
          {/* Main Content */}
          <div className="content-wrapper">
            <section className="hero-section">
              <div className="icon-container">
                <img width={400} src="./src/radical-candor_featured2@2x-1560x760.png" alt="" />
              </div>

              <div className="title-section">
                <Heading 
                  type="h1" 
                  size="large" 
                  align="center" 
                  weight="medium"
                  className="main-heading"
                >
                  {isNegativeStatus ? 'Help Us Improve' : 'Share Your Joy'}
                </Heading>
                
                <Text align="center">
                  {isNegativeStatus 
                    ? 'Your feedback helps us create better experiences'
                    : 'We\'d love to hear what made your experience special'
                  }
                </Text>
              </div>
            </section>

            {/* Feedback Form */}
            <div className="form-section">
              <div className="textarea-container">
                <TextArea
                  rows="6"
                  label={isNegativeStatus ? "What can we improve?" : "What did you love most?"}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
              
              <div className="submit-section">
                <Button
                  onClick={submitFeedback}
                  disabled={!feedback.trim() || isLoading}
                  size="large"
                  kind="primary"
                  className="submit-button"
                >
                  {isLoading ? (
                    <>
                      <Icon iconType="fa" icon="spinner" className="spinning" />
                      Submitting...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <Icon iconType="fa" icon="check" />
                      Submitted!
                    </>
                  ) : (
                    `Submit ${isNegativeStatus ? 'Feedback' : 'Testimonial'}`
                  )}
                </Button>
              </div>
            </div>

            {/* Success Message */}
            {isSubmitted && (
              <div className="success-message">
                <Icon iconType="fa" icon="check-circle" iconSize="24" />
                <span>Thank you! Your {isNegativeStatus ? 'feedback' : 'testimonial'} has been received.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;