
from setuptools import setup, find_packages
with open("README.md", "r", encoding="utf-8") as fh:
long_description = fh.read()
with open("backend/requirements.txt", "r", encoding="utf-8") as fh:
requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]
setup(
name="astra-grid",
version="1.0.0",
author="Your Name",
author_email="your.email@example.com",
description="Autonomous Telecom & Data Center Guardian with Embodied AI",
long_description=long_description,
long_description_content_type="text/markdown",
url="https://github.com/your-profile/astra-grid",
project_urls={
"Bug Tracker": "https://github.com/your-profile/astra-grid/issues",
"Documentation": "https://github.com/your-profile/astra-grid/blob/main/README.md",
"Source Code": "https://github.com/your-profile/astra-grid",
},
packages=find_packages(where="backend"),
package_dir={"": "backend"},
classifiers=[
"Development Status :: 4 - Beta",
"Intended Audience :: Developers",
"Intended Audience :: Science/Research",
"License :: OSI Approved :: Apache Software License",
"Operating System :: OS Independent",
"Programming Language :: Python :: 3",
"Programming Language :: Python :: 3.11",
"Topic :: Scientific/Engineering :: Artificial Intelligence",
"Topic :: Software Development :: Libraries :: Python Modules",
],
python_requires=">=3.11",
install_requires=requirements,
extras_require={
"dev": [
"pytest>=7.4.0",
"pytest-asyncio>=0.21.0",
"pytest-cov>=4.1.0",
"black>=23.0.0",
"flake8>=6.0.0",
"mypy>=1.5.0",
],
},
entry_points={
"console_scripts": [
"astra-grid=app.main:main",
],
},
)
