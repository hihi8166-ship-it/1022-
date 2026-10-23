"""Run the current Talentbank browser interaction checks."""
from runpy import run_path
run_path(str(__import__("pathlib").Path(__file__).with_name("verify_workflows.py")), run_name="__main__")
