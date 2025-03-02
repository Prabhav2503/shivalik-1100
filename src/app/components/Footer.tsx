'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import React, { CSSProperties } from 'react';

const Footer = () => {
  // Define styles as JavaScript objects
  const styles : Record<string, CSSProperties> = {
    footer: {
      backgroundColor:'rgb(23 23 23)',
      color: 'white',
      padding: '2rem 0',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    flexContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    section: {
      marginBottom: '1.5rem',
    },
    heading: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
    },
    list: {
      listStyle: 'none',
      padding: 0,
    },
    listItem: {
      marginBottom: '0.5rem',
    },
    link: {
      color: '#a0aec0',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
    },
    linkHover: {
      color: 'white',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      color: '#a0aec0',
    },
    icon: {
      marginRight: '0.5rem',
    },
    socialContainer: {
      display: 'flex',
    },
    socialLink: {
      marginRight: '1rem',
      color: '#a0aec0',
    },
    divider: {
      borderTop: '1px solid #2d3748',
      marginTop: '2rem',
      paddingTop: '2rem',
    },
    copyright: {
      textAlign: 'center',
      color: '#a0aec0',
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.flexContainer}>
          {/* Quick Links */}
          <div style={styles.section}>
            <h2 style={styles.heading}>Quick Links</h2>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <Link href="/" style={styles.link} 
                  onMouseOver={(e) => e.currentTarget.style.color = 'white'} 
                  onMouseOut={(e) => e.currentTarget.style.color = '#a0aec0'}>
                  Home
                </Link>
              </li>
              <li style={styles.listItem}>
                <Link href="/team" style={styles.link}
                  onMouseOver={(e) => e.currentTarget.style.color = 'white'} 
                  onMouseOut={(e) => e.currentTarget.style.color = '#a0aec0'}>
                  Team
                </Link>
              </li>
              <li style={styles.listItem}>
                <Link href="/achievements" style={styles.link}
                  onMouseOver={(e) => e.currentTarget.style.color = 'white'} 
                  onMouseOut={(e) => e.currentTarget.style.color = '#a0aec0'}>
                  Achievements
                </Link>
              </li>
              <li style={styles.listItem}>
                <Link href="/complaints" style={styles.link}
                  onMouseOver={(e) => e.currentTarget.style.color = 'white'} 
                  onMouseOut={(e) => e.currentTarget.style.color = '#a0aec0'}>
                  Complaints
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div style={styles.section}>
            <h2 style={styles.heading}>Services</h2>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <Link href="/library-booking" style={styles.link}
                  onMouseOver={(e) => e.currentTarget.style.color = 'white'} 
                  onMouseOut={(e) => e.currentTarget.style.color = '#a0aec0'}>
                  Library Booking
                </Link>
              </li>
              <li style={styles.listItem}>
                <Link href="/cr-booking" style={styles.link}
                  onMouseOver={(e) => e.currentTarget.style.color = 'white'} 
                  onMouseOut={(e) => e.currentTarget.style.color = '#a0aec0'}>
                  CR Booking
                </Link>
              </li>
              <li style={styles.listItem}>
                <Link href="/mess-menu" style={styles.link}
                  onMouseOver={(e) => e.currentTarget.style.color = 'white'} 
                  onMouseOut={(e) => e.currentTarget.style.color = '#a0aec0'}>
                  Mess Menu
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div style={styles.section}>
            <h2 style={styles.heading}>Contact Us</h2>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <a href="mailto:contact@example.com" style={styles.contactItem}
                   onMouseOver={(e) => e.currentTarget.style.color = 'white'} 
                   onMouseOut={(e) => e.currentTarget.style.color = '#a0aec0'}>
                  <svg style={{width:"1.25rem",height:"1.25rem",marginRight:"0.5rem"}} className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
                  contact@example.com
                </a>
              </li>
              <li style={styles.listItem}>
                <a href="tel:+1234567890" style={styles.contactItem}
                   onMouseOver={(e) => e.currentTarget.style.color = 'white'} 
                   onMouseOut={(e) => e.currentTarget.style.color = '#a0aec0'}>
                  <svg style={{width:"1.25rem",height:"1.25rem",marginRight:"0.5rem"}} className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
                  +123 456 7890
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div style={styles.section}>
            <h2 style={styles.heading}>Follow Us</h2>
            <div style={styles.socialContainer}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 style={styles.socialLink}
                 onMouseOver={(e) => e.currentTarget.style.color = 'white'} 
                 onMouseOut={(e) => e.currentTarget.style.color = '#a0aec0'}>
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 style={styles.socialLink}
                 onMouseOver={(e) => e.currentTarget.style.color = 'white'} 
                 onMouseOut={(e) => e.currentTarget.style.color = '#a0aec0'}>
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                 style={styles.socialLink}
                 onMouseOver={(e) => e.currentTarget.style.color = 'white'} 
                 onMouseOut={(e) => e.currentTarget.style.color = '#a0aec0'}>
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{...styles.divider, ...styles.copyright}}>
          <p>© 2024 Student Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;