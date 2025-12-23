
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

class LLaMAFactoryModel:
    """LLaMA-Factory fine-tuned ERNIE 4.5 for technical veracity"""
    
    def __init__(self, model_path: str = "./models/weights/astra-grid-llamafactory"):
        self.model_path = model_path
        self.model = None
        self.tokenizer = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Initializing LLaMAFactoryModel on {self.device}")
        
        self.safety_standards = {
            'OSHA 1910.269': 'Electric Power Generation, Transmission, and Distribution',
            'IEEE C2-2023': 'National Electrical Safety Code',
            'NFPA 70E': 'Electrical Safety in the Workplace',
            'IEC 61850': 'Communication Networks and Systems for Power Utility Automation',
            'IEEE 802.3': 'Ethernet Standards for Data Centers'
        }
        
    def load_model(self):
        """Load SFT model with prompt masking"""
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(
                "ERNIE-4.5-21B",
                trust_remote_code=True
            )
            
            base_model = AutoModelForCausalLM.from_pretrained(
                "ERNIE-4.5-21B",
                load_in_4bit=True,
                device_map="auto",
                trust_remote_code=True,
                use_flash_attention_2=True
            )
            
            self.model = PeftModel.from_pretrained(
                base_model,
                self.model_path
            )
            
            self.model.eval()
            logger.info("LLaMAFactoryModel loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading LLaMAFactoryModel: {e}")
            raise
    
    def validate_compliance(self, component_data: Dict, analyst_report: Dict) -> Dict:
        """Validate against safety codes and regulations"""
        
        prompt = f"""### Instruction: Review the Network Analyst's report against safety protocols and electrical standards. Identify regulatory violations or safety hazards.

### Input: 
Component: {component_data.get('component_id')}
Status: {component_data.get('status')}
Risk Category: {analyst_report.get('risk_category')}
Risk Score: {analyst_report.get('risk_score')}

### Response:"""

        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
        
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=512,
                temperature=0.3,
                top_p=0.95
            )
        
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        violations = self._extract_violations(response, analyst_report)
        
        return {
            "component_id": component_data.get('component_id'),
            "violations": violations,
            "compliant": len(violations) == 0,
            "regulatory_citations": [v['regulation'] for v in violations],
            "model_response": response,
            "model_type": "LLaMAFactory-ERNIE-4.5"
        }
    
    def _extract_violations(self, response: str, analyst_report: Dict) -> List[Dict]:
        """Extract violations from model response"""
        violations = []
        
        if analyst_report.get('risk_category') == 'Critical':
            violations.append({
                'component': analyst_report.get('component_id'),
                'violation_type': 'High-risk component operating beyond safe parameters',
                'regulation': 'OSHA 1910.269',
                'description': self.safety_standards['OSHA 1910.269'],
                'required_action': 'Immediate shutdown and replacement',
                'severity': 'Critical'
            })
        
        return violations
    
    def batch_validate(self, components: List[Dict], analyst_reports: List[Dict]) -> List[Dict]:
        """Batch validation for multiple components"""
        results = []
        for comp, report in zip(components, analyst_reports):
            result = self.validate_compliance(comp, report)
            results.append(result)
        return results
