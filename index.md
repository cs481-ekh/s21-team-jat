## ALD Web Interface

### Abstract

Atomic layer deposition (ALD) is a variation of chemical vapor deposition (CVD) and is a process for depositing thin to ultra-thin films on surfaces using surface chemical reactions. In some cases, an ALD process can require several hundred cycles, each of which may take several minutes to complete. Additional time may be required for temperature stabilization or other processing steps. Thus, the ALD operator cannot remain with the tool throughout the run.

Previously, remote access software (like TeamViewer) was used to monitor and control the status of a currently running ALD process. In order to facilitate collaboration with others, a password-protected web interface for monitoring the ALD process was created. This interface provides monitoring capabilities only, and doesn't provide any control to the process. Once deployed, users will be able to access this interface if the address is known along with connection to Boise State's VPN servcies. 

This project was divided into three parts, retrieving the data, hosting the data, and presenting the data. The first part was completed with a python script to retrieve the data. As the ALD process ran, various CSV files were saved to a location containing all the generated data. With use of Python, data was to be extracted from those files and saved to a JSON file. The second part was the development of a Docker image of NodeJS + Express server that will be used to host the web interface and read the data the JSON file. From there, the web server will authenticate the user and allow access to the web frontend that will display the visualizations and data from the ALD process. The third part, the web frontend will be developed using HTML, CSS, and JavaScript and contains the various data fields and graphs to help visualize the data in a meaningful way.  


## Architectural Diagram
![Image](/cs481.PNG)

### Members
- Aidan Van Leuven
- Joe Gibson
- Thomas Reinking

### Project Demo:
Coming Soon
