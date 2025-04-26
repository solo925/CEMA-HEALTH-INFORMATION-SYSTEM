from cryptography.fernet import Fernet
from django.conf import settings
import base64
import os

class Encryptor:
    """
    Utility class for encrypting and decrypting sensitive data.
    """
    
    def __init__(self):
        # Get or generate encryption key
        key = self._get_or_create_key()
        self.cipher_suite = Fernet(key)
    
    def _get_or_create_key(self):
        """Get the encryption key from settings or generate a new one"""
        env_key = os.environ.get('ENCRYPTION_KEY')
        
        if env_key:
            # Ensure key is properly formatted for Fernet
            try:
                # Attempt to add padding if needed
                missing_padding = len(env_key) % 4
                if missing_padding:
                    env_key += '=' * (4 - missing_padding)
                return base64.urlsafe_b64decode(env_key)
            except:
                pass
                
        # If no valid key is available, generate a new one
        return Fernet.generate_key()
    
    def encrypt(self, data):
        """
        Encrypt data
        
        Args:
            data (str): Data to encrypt
            
        Returns:
            str: Encrypted data in base64 format
        """
        if not data:
            return data
            
        # Convert string to bytes if necessary
        if isinstance(data, str):
            data = data.encode('utf-8')
            
        # Encrypt the data
        encrypted_data = self.cipher_suite.encrypt(data)
        
        # Return as base64 string
        return base64.urlsafe_b64encode(encrypted_data).decode('utf-8')
    
    def decrypt(self, encrypted_data):
        """
        Decrypt data
        
        Args:
            encrypted_data (str): Encrypted data in base64 format
            
        Returns:
            str: Decrypted data
        """
        if not encrypted_data:
            return encrypted_data
            
        try:
            # Convert from base64 string if necessary
            if isinstance(encrypted_data, str):
                encrypted_data = base64.urlsafe_b64decode(encrypted_data)
                
            # Decrypt the data
            decrypted_data = self.cipher_suite.decrypt(encrypted_data)
            
            # Return as string
            return decrypted_data.decode('utf-8')
        except Exception as e:
            # Log the error but do not expose details
            print(f"Decryption error: {type(e).__name__}")
            return None