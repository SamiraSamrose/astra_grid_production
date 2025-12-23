
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

class UnslothModel:
    """Unsloth fine-tuned ERNIE 4.5 for structural reasoning"""
    
    def __init__(self, model_path: str = "./models/weights/astra-grid-unsloth"):
        self.model_path = model_path
        self.model = None
        self.tokenizer = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Initializing UnslothModel on {self.device}")
        
    def load_model(self):
        """Load 4-bit quantized model with LoRA"""
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(
                "ERNIE-4.5-21B",
                trust_remote_code=True
            )
            
            base_model = AutoModelForCausalLM.from_pretrained(
                "ERNIE-4.5-21B",
                load_in_4bit=True,
                device_map="auto",
                trust_remote_code=True
            )
            
            self.model = PeftModel.from_pretrained(
                base_model,
                self.model_path
            )
            
            self.model.eval()
            logger.info("UnslothModel loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading UnslothModel: {e}")
            raise
    
    def predict_failure(self, component_data: Dict) -> Dict:
        """Predict component failure using structural reasoning"""
        
        prompt = f"""### Instruction: Analyze the following electrical schematic. Identify all circuit breakers and their current status based on the OCR markers. Generate a Markdown table for the Astra-Grid dashboard.

### Input: Component ID: {component_data.get('component_id')}
Status: {component_data.get('status')}
Temperature: {component_data.get('temperature')}°C
Voltage: {component_data.get('voltage')}V
Last Maintenance: {component_data.get('last_maintenance')}

### Response:"""

        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
        
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=512,
                temperature=0.7,
                top_p=0.9,
                do_sample=True
            )
        
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        risk_score = self._extract_risk_score(response)
        
        return {
            "component_id": component_data.get('component_id'),
            "risk_score": risk_score,
            "risk_category": "Critical" if risk_score > 0.7 else ("Warning" if risk_score > 0.4 else "Stable"),
            "model_response": response,
            "model_type": "Unsloth-ERNIE-4.5"
        }
    
    def _extract_risk_score(self, response: str) -> float:
        """Extract risk score from model response"""
        import re
        match = re.search(r'risk.*?(\d+\.?\d*)%', response.lower())
        if match:
            return float(match.group(1)) / 100
        return 0.15
    
    def batch_predict(self, components: List[Dict]) -> List[Dict]:
        """Batch prediction for multiple components"""
        results = []
        for comp in components:
            result = self.predict_failure(comp)
            results.append(result)
        return results
