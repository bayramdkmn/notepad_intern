"""Notes table is_featured_note and feature date added

Revision ID: 4cb6b48b17e7
Revises: 
Create Date: 2025-11-05 17:06:12.822178

"""
from email.policy import default
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4cb6b48b17e7'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('notes',sa.Column('is_feature_note',sa.Boolean(),default=False))
    op.add_column('notes',sa.Column('feature_date',sa.DateTime()))


def downgrade() -> None:
    """Downgrade schema."""
    pass
